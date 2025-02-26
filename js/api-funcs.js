/////////////////////////////
//   API CALL FUNCTIONS    //
/////////////////////////////

// Main method to kick of querying the POTA API when the button is clicked or automatically
// on load.
function callAPI() {
    // Clear existing data
    parks.clear();
    parks.length = 0;
    $("span#potaApiStatus").html("<i class='fa-solid fa-hourglass-half'></i> Loading...");
    // Get the bounds of the map for the query
    let bounds = map.getBounds();
    let queryURL = POTA_PARKS_URL + bounds.getSouth() + "/" + bounds.getWest() + "/" + bounds.getNorth() + "/" + bounds.getEast() + "/0";
    $.ajax({
        url: queryURL,
        dataType: 'json',
        timeout: 10000,
        success: async function (result) {
            handlePOTAData(result, bounds);
            updateMapObjects();
            $("span#potaApiStatus").html("<i class='fa-solid fa-check'></i> OK");
        },
        error: function () {
            $("span#potaApiStatus").html("<i class='fa-solid fa-triangle-exclamation'></i> Error!");
        }
    });
}

// Bind this action to the run button
$("#run").click(function () {
    callAPI();
});


/////////////////////////////
// DATA HANDLING FUNCTIONS //
/////////////////////////////

// Interpret POTA data and update the internal data model
function handlePOTAData(result, bounds) {
    // Add the retrieved parks to the list
    let parkUpdate = objectToMap(result);
    let i = 0;
    parkUpdate.get("features").forEach(park => {
        const ref = park.properties.reference;
        const newPark = {
            uid: ref,
            ref: ref,
            name: park.properties.name,
            lat: park.geometry.coordinates[1],
            lon: park.geometry.coordinates[0],
            activationChecked: false,
            activated: false,
            activatedByMe: false,
            activationCount: 0,
            activationByMeCount: 0,
            lastActivationDate: null,
            lastActivationCallsign: null,
            lastActivationByMeDate: null,
        };
        // Bounds check before we populate the internal data model. POTA is not very strict on only returning parks inside the bounding
        // box we asked for, so to avoid excess clutter on our own map, we check the bounds here and only add ones that are *really*
        // on our screen.
        if (newPark.lat >= bounds.getSouth() && newPark.lat <= bounds.getNorth() && newPark.lon >= bounds.getWest() && newPark.lon <= bounds.getEast()) {
            parks.set(ref, newPark);

            // Now we need to fetch the park's list of activators to see if it's ever been activated, and activated by us. We do this
            // asynchronously, with a delay to avoid overloading the API. The net effect is that markers will colour in slowly over the
            // course of a few seconds.
            setTimeout(function() {
                $.ajax({
                    url: POTA_ACTIVATIONS_URL + ref + "?count=all",
                    dataType: 'json',
                    timeout: 10000,
                    success: async function (result) {
                        if (result != null) {
                            updateParkStatus(ref, result);
                        }
                    }
                });
            }, i++ * API_CALL_RATE_LIMIT_MILLIS);
        }
    });
}

// Update the park's status when more info is retrieved from the API.
function updateParkStatus(uid, apiResponse) {
    let activations = objectToMap(apiResponse);
    let updatePark = parks.get(uid);
    // Park might not be present in our list because it was removed in the mean time, so check for that
    if (updatePark != null) {
        updatePark.activationChecked = true;
        updatePark.activationCount = activations.size;
        if (activations.size > 0) {
            updatePark.activated = true;
            updatePark.lastActivationDate = moment.utc(activations.get("0").qso_date, "YYYYMMDD");
            updatePark.lastActivationCallsign = activations.get("0").activeCallsign;
            let actxByMe = 0;
            activations.forEach(activation => {
                if (myCallsign === activation.activeCallsign) {
                    updatePark.activatedByMe = true;
                    actxByMe = actxByMe + 1;
                    if (updatePark.lastActivationByMeDate == null) {
                        updatePark.lastActivationByMeDate = moment.utc(activation.qso_date, "YYYYMMDD");
                    }
                }
            });
            updatePark.activationByMeCount = actxByMe;
        }
        parks.set(uid, updatePark);
        updateMapObjects();
    }
}

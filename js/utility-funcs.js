/////////////////////////////
//    UTILITY FUNCTIONS    //
/////////////////////////////

// Utility to convert an object created by JSON.parse() into a proper JS map.
function objectToMap(o) {
    let m = new Map();
    for (let k of Object.keys(o)) {
        m.set(k, o[k]);
    }
    return m;
}

// Get an icon for a park, coloured based on its activated status
function getIcon(park) {
    let color = 'grey';
    if (park.activationChecked) {
        if (park.activatedByMe) {
            color = 'green';
        } else if (park.activated) {
            color = 'yellow';
        } else {
            color = 'red';
        }
    }
    return L.ExtraMarkers.icon({
        icon: 'fa-tree',
        iconColor: "black",
        markerColor: color,
        shape: 'circle',
        prefix: 'fa',
        svg: true
    });
}

// Turn a park reference into a URL
function getURLforReference(reference) {
    return "https://pota.app/#/park/" + reference;
}

// Push a URL to the address bar with lat, lon, zoom and callsign
function pushURLToAddressBar() {
    if (window.location.href.startsWith("http")) {
        let queryString = "?lat=" + map.getCenter().lat.toFixed(6) + "&lon=" + map.getCenter().lng.toFixed(6) + "&zoom=" + map.getZoom();
        if (myCallsign) {
            queryString += "&callsign=" + myCallsign;
        }
        window.history.pushState({}, "", "/" + queryString);
    }
}

// If we have a set of URL parameters, run the API calls. This is used so that when sharing a URL,
// with lat/lon/zoom and callsign parameters, you are effectively sharing the result as well.
// If this is the case, lat/lon/zoom/callsign will already have been loaded into the UI, so all
// we need to do is run the API call here.
function runOnStartupIfURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("lat") && urlParams.has("lon") && urlParams.has("zoom")) {
        // Still apply minimum zoom check
        if (map.getZoom() > MIN_ZOOM_TO_ALLOW_QUERY) {
            callAPI();
        }
    }
}

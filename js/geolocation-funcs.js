/////////////////////////////
//       GEOLOCATION       //
/////////////////////////////

// Request geolocation, using in order:
// 1. A manually set location (e.g. loaded from localstorage)
// 2. Browser geolocation
// 3. An online lookup service
// A marker will be created and the map zoomed to the location.
function requestGeolocation() {
    if (ownPosOverride != null) {
        setOwnLocation(new L.LatLng(ownPosOverride.lat, ownPosOverride.lng));
    } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            setOwnLocation(new L.LatLng(position.coords.latitude, position.coords.longitude));
        }, function () {
            requestGeolocationOnline();
        });
    } else {
        requestGeolocationOnline();
    }
}

// Request geolocation from an online service. Fallback in case normal geolocation fails.
// Annoying two step process. IPify offers IP address info via HTTPS for free, but
// not GeoIP info. Hacker Target offers GeoIP info via HTTPS for free, but there is no
// way to specify "use the IP address I am connecting from".
function requestGeolocationOnline() {
    $.ajax({
        url: IP_LOOKUP_URL,
        dataType: 'json',
        timeout: 10000,
        success: async function (result) {
            const ip = result.ip;
            $.ajax({
                url: GEOLOCATION_API_URL + ip,
                dataType: 'json',
                timeout: 10000,
                success: async function (result2) {
                    setOwnLocation(new L.LatLng(result2.latitude, result2.longitude));
                },
                error: function () {
                    console.log("Geolocation lookup failed");
                }
            });
        },
        error: function () {
            console.log("IP lookup for geolocation failed");
        }
    });
}

// Set the user's location to the provided value, add/update the marker, and move the view
// to centre it, so long as the view hasn't yet been panned somewhere else.
function setOwnLocation(newPos) {
    // Store position
    myPos = newPos;

    // Pan and zoom the map to show the user's location. Suppress this if the user has already been
    // moving the map around, to avoid disrupting their experience
    if (!alreadyMovedMap) {
        map.setView(newPos, 11, {
            animate: true,
            duration: 1.0
        });
    }

    // Add or replace the marker
    if (ownPosLayer == null) {
        ownPosLayer = new L.LayerGroup();
        ownPosLayer.addTo(map);
    }
    if (ownPosMarker != null) {
        ownPosLayer.removeLayer(ownPosMarker);
        oms.removeMarker(ownPosMarker);
        createOwnPosMarker(newPos);
    } else {
        // Short delay to remove some issues with the marker icon not being loaded first time
        setTimeout(function () {
            createOwnPosMarker(newPos);
        }, 1000);
    }
}

// Create and apply the own position marker
function createOwnPosMarker(newPos) {
    ownPosMarker = L.marker(newPos, {
        icon: L.ExtraMarkers.icon({
            icon: 'fa-house',
            iconColor: 'white',
            markerColor: 'dodgerblue',
            shape: 'circle',
            prefix: 'fa',
            svg: true
        }),
        draggable: true,
        autoPan: true
    });    ownPosMarker.tooltip = "You are here!<br/><span class='youAreHereNote'>(Or so we think. If not, just drag this marker where it should be and we'll remember.)</span>";
    // If the marker gets dragged, update own position and store the value
    ownPosMarker.on('dragend', function () {
        setOwnPositionOverride(ownPosMarker.getLatLng());
        localStorage.setItem('ownPosOverride', JSON.stringify(latlon));
    });
    ownPosLayer.addLayer(ownPosMarker);
    oms.addMarker(ownPosMarker);
}

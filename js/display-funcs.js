/////////////////////////////
//   UI UPDATE FUNCTIONS   //
/////////////////////////////
// noinspection DuplicatedCode

// Update the objects that are rendered on the map. Clear old markers and draw new ones. This is
// called when the data model changes due to a server query.
function updateMapObjects() {
    // Iterate through parks, sorted by time so that new markers are created on top of older ones. For each, update an existing marker
    // or create a new marker if required.
    const parkObjects = Array.from(parks.values());
    parkObjects.forEach(function (s) {
        const pos = getIconPosition(s);

        if (markers.has(s.uid) && pos != null) {
            // Existing marker, so update it
            let m = markers.get(s.uid);

            // Regenerate marker color & text in case the park status has updated
            m.setIcon(getIcon(s));

            // Set tooltip
            m.tooltip = getTooltipText(s);

        } else if (pos != null) {
            // No existing marker, data is valid, so create
            let m = L.marker(pos, {icon: getIcon(s)});
            m.uid = s.uid;

            // Add to map and spiderfier
            markersLayer.addLayer(m);
            oms.addMarker(m);

            // Set tooltip
            m.tooltip = getTooltipText(s);

            // Add to internal data store
            markers.set(s.uid, m);
        }
    });

    // Iterate through markers. If one corresponds to a dropped park, delete it
    markers.forEach(function (marker, uid) {
        if (!parks.has(uid)) {
            marker.closePopup();
            markersLayer.removeLayer(marker);
            markers.delete(uid);
        }
    });
}



/////////////////////////////
//  PARK DISPLAY FUNCTIONS //
/////////////////////////////

// Tooltip text for the normal click-to-appear tooltips
function getTooltipText(park) {
    let ttt = "<a href='" + getURLforReference(park.ref) + "' target='_blank'>" + park.ref + " " + park.name + "</a>";
    if (park.activationChecked) {
        if (park.activated) {
            ttt = ttt + "<br/>Activated " + park.activationCount + " time(s), most recently by " + park.lastActivationCallsign + " on " + park.lastActivationDate.format('D MMM YYYY') + ".";
            if (park.activatedByMe) {
                ttt = ttt + "<br/>You have activated " + park.activationByMeCount + " time(s), most recently on " + park.lastActivationByMeDate.format('D MMM YYYY') + ".";
            } else if (park.failedActivationsByMe) {
                ttt = ttt + "<br/>You have attempted activating this park, but not yet succeeded.";
            }
        } else {
            ttt = ttt + "<br/>This park has never been activated.";
        }
    }
    return ttt;
}


// Gets the lat/long position for the icon representing a park. Null is returned if the position
// is unknown or 0,0. If the user's own geolocation has been provided, we adjust the longitude of the
// park to be their longitude +-180 degrees, so that we are correctly displaying markers either
// side of them on the map, and calculating the great circle distance and bearing as the short
// path.
function getIconPosition(s) {
    if (s["lat"] != null && s["lon"] != null && !isNaN(s["lat"]) && !isNaN(s["lon"]) && (s["lat"] !== 0.0 || s["lon"] !== 0.0)) {
        let wrapEitherSideOfLon = 0;
        if (myPos != null) {
            wrapEitherSideOfLon = myPos.lng;
        }
        let tmpLon = s["lon"];
        while (tmpLon < wrapEitherSideOfLon - 180) {
            tmpLon += 360;
        }
        while (tmpLon > wrapEitherSideOfLon + 180) {
            tmpLon -= 360;
        }
        return [s["lat"], tmpLon];
    } else {
        return null;
    }
}

// On marker click (after spiderfy when required), open popup. This is needed instead of just doing marker.openTooltip()
// due to the way the spiderfier plugin needs to capture click events and manage a single global popup.
function openSpiderfierPopup(marker) {
    // Set popup content and position
    globalPopup.setContent(marker.tooltip);
    globalPopup.setLatLng(marker.getLatLng());
    // Open the popup
    map.openPopup(globalPopup);
}

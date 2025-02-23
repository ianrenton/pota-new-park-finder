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

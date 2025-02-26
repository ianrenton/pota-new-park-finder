/////////////////////////////
// LOCAL STORAGE FUNCTIONS //
/////////////////////////////

// Load from local storage or use default
function localStorageGetOrDefault(key, defaultVal) {
    const valStr = localStorage.getItem(key);
    if (null === valStr) {
        return defaultVal;
    } else {
        return JSON.parse(valStr);
    }
}

// Load from local storage and set GUI up appropriately
function loadLocalStorage() {
    // My callsign. Load from local storage if we have it, but providing a URL parameter overrides that
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("callsign")) {
        myCallsign = urlParams.get("callsign");
    } else {
        myCallsign = localStorageGetOrDefault('myCallsign', myCallsign);
    }
    $("#myCallsign").val(myCallsign);

    // Map default view
    lastViewCentre = localStorageGetOrDefault('lastViewCentre', lastViewCentre);
    lastViewZoom = localStorageGetOrDefault('lastViewZoom', lastViewZoom);

    // Overridden geolocation
    ownPosOverride = localStorageGetOrDefault('ownPosOverride', ownPosOverride);
}

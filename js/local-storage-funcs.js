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
    // My callsign
    myCallsign = localStorageGetOrDefault('myCallsign', myCallsign);
    $("#myCallsign").val(myCallsign);

    // Map default view
    lastViewCentre = localStorageGetOrDefault('lastViewCentre', lastViewCentre);
    lastViewZoom = localStorageGetOrDefault('lastViewZoom', lastViewZoom);

    // Overridden geolocation
    ownPosOverride = localStorageGetOrDefault('ownPosOverride', ownPosOverride);
}

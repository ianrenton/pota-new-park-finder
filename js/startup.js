/////////////////////////////
//         STARTUP         //
/////////////////////////////

// Load settings
loadLocalStorage();
// Set up map
setUpMap();
// Request geolocation
requestGeolocation();
// Check if we have URL parameters and need to run automatically
runOnStartupIfURLParameters();

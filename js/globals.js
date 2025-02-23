/////////////////////////////
//        CONSTANTS        //
/////////////////////////////

const POTA_PARKS_URL = "https://api.pota.app/park/grids/";
const POTA_ACTIVATIONS_URL = "https://api.pota.app/park/activations/";
const IP_LOOKUP_URL = "https://api.ipify.org/?format=json";
const GEOLOCATION_API_URL = "https://api.hackertarget.com/geoip/?output=json&q=";
const BASEMAP = "CartoDB.Voyager";
const BASEMAP_OPACITY = 1.0;
const MAX_ZOOM = 17;
const MIN_ZOOM_TO_ALLOW_QUERY = 7;
const API_CALL_RATE_LIMIT_MILLIS = 100;


/////////////////////////////
//      DATA STORAGE       //
/////////////////////////////

const parks = new Map(); // uid -> park data
const markers = new Map(); // uid -> marker
let myPos = null;
let map;
let backgroundTileLayer;
let markersLayer;
let ownPosLayer;
let ownPosMarker;
let oms;
let globalPopup;
let alreadyMovedMap = false;
const onMobile = window.matchMedia('screen and (max-width: 800px)').matches;


/////////////////////////////
//  UI CONFIGURABLE VARS   //
/////////////////////////////

// These are all parameters that can be changed by the user by clicking buttons or otherwise using GUI,
// and are persisted in local storage.
let myCallsign = "";
let lastViewCentre = null; // LatLng. Set on all map moves so the view is persistent.
let lastViewZoom = 0;
let ownPosOverride = null; // LatLng. Set if own position override is set or loaded from localstorage. If null, myPos will be set from browser geolocation or GeoIP lookup.

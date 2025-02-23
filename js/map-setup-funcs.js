/////////////////////////////
//       MAP SETUP         //
/////////////////////////////

function setUpMap() {
    // Create map
    map = L.map('map', {
        zoomControl: false,
        minZoom: 2,
        maxZoom: 14
    });

    // Add basemap
    backgroundTileLayer = L.tileLayer.provider(BASEMAP, {
        opacity: BASEMAP_OPACITY,
        edgeBufferTiles: 1
    });
    backgroundTileLayer.addTo(map);
    backgroundTileLayer.bringToBack();

    // Add marker layer
    markersLayer = new L.LayerGroup();
    markersLayer.addTo(map);

    // Add spiderfier
    oms = new OverlappingMarkerSpiderfier(map, {keepSpiderfied: true, legWeight: 2.0});
    globalPopup = new L.Popup({offset: L.point({x: 0, y: -20})});
    // noinspection JSDeprecatedSymbols,JSCheckFunctionSignatures
    oms.addListener('click', function (marker) {
        openSpiderfierPopup(marker);
    });

    // Display a default view.
    if (lastViewCentre != null) {
        // We have a persisted last view from the previous time the user visited the website, go to it.
        // Also call "map proj changed" which will enable/disable the button as necessary, and set "already
        // moved map" so that when geolocation happens, it doesn't steal the view.
        map.setView([lastViewCentre.lat, lastViewCentre.lng], lastViewZoom);
        mapProjChanged();
    } else {
        // We have no idea where the user is in the world so set a default view. If geolocation subsequently
        // happens, the view will be moved to centre the marker.
        map.setView([30, 0], 3);
    }

    // Add callbacks on moving the view
    map.on('moveend', function () {
        mapProjChanged();
    });
    map.on('zoomend', function () {
        mapProjChanged();
    });
}

// Callback on map projection (pan/zoom) change. Used to update the controls according to zoom level and persist view.
function mapProjChanged() {
    // Show/hide controls based on zoom
    let zoomlevel = map.getZoom();
    if (zoomlevel > MIN_ZOOM_TO_ALLOW_QUERY) {
        $('#zoomin').hide();
        $('#zoomok').show();
    } else {
        $('#zoomin').show();
        $('#zoomok').hide();
    }

    // Persist view
    lastViewCentre = map.getCenter();
    lastViewZoom = zoomlevel;
    localStorage.setItem('lastViewCentre', JSON.stringify(lastViewCentre));
    localStorage.setItem('lastViewZoom', JSON.stringify(lastViewZoom));

    // Record that the projection changed. If this happens before initial "zoom to my location",
    // we ignore that to avoid moving the user's view.
    alreadyMovedMap = true;
}

/**
 * Map Initialization and Configuration
 * Uses OpenLayers library for web mapping functionality
 */

// Initialize the OpenLayers map
const map = new ol.Map({
    target: 'map',  // HTML element ID where map will be rendered
    layers: [
        // Base layer - OpenStreetMap (free tile service)
        // Provides the background map with streets, buildings, etc.
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        // Set initial map center to Tehran, Iran
        // fromLonLat converts [longitude, latitude] to map projection (EPSG:3857)
        center: ol.proj.fromLonLat([51.388974, 35.689198]),
        zoom: 12  // Initial zoom level (0 = world view, higher = more zoomed in)
    })
});

/**
 * Close the feature information panel
 * Called when user clicks the X button on the info panel
 */
function closeFeatureInfo() {
    // Remove 'active' class to hide the panel (CSS display: none)
    document.getElementById('feature-info').classList.remove('active');
}
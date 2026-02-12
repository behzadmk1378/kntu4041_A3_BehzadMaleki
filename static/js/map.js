/**
 * Map Initialization and Configuration
 * Uses OpenLayers library for web mapping functionality
 */

// Create WMS source for GeoServer layer
// This source will be used for both display and GetFeatureInfo queries
const wmsSource = new ol.source.TileWMS({
    // Public GeoServer WMS endpoint (for testing)
    // Replace with your own GeoServer URL: 'http://your-server/geoserver/wms'
    url: 'https://ahocevar.com/geoserver/wms',
    params: {
        'LAYERS': 'topp:states',  // Workspace:LayerName format
        'TILED': true  // Request tiled images for better performance
    },
    serverType: 'geoserver',  // Optimizes requests for GeoServer
    transition: 0  // No fade-in transition for tiles
});

// Create WMS layer from the source
const wmsLayer = new ol.layer.Tile({
    source: wmsSource
});

// Initialize the OpenLayers map
const map = new ol.Map({
    target: 'map',  // HTML element ID where map will be rendered
    layers: [
        // Base layer - OpenStreetMap (free tile service)
        // Provides the background map with streets, buildings, etc.
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
        
        // WMS Layer from GeoServer (on top of base layer)
        wmsLayer
    ],
    view: new ol.View({
        // Set initial map center to USA (to see the states layer)
        // fromLonLat converts [longitude, latitude] to map projection (EPSG:3857)
        center: ol.proj.fromLonLat([-100, 40]),  // Center of USA
        zoom: 4  // Zoom level to see multiple states
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
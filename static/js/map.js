// Initialize the map
const map = new ol.Map({
    target: 'map',
    layers: [
        // Base layer - OpenStreetMap
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([51.388974, 35.689198]), // Tehran coordinates
        zoom: 12
    })
});

// Function to close feature info panel
function closeFeatureInfo() {
    document.getElementById('feature-info').classList.remove('active');
}
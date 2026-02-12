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

// Create OSM base layer
const osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// Loading indicator management
let tilesLoading = 0;

// Show loading indicator when tiles start loading
wmsSource.on('tileloadstart', function() {
    tilesLoading++;
    if (tilesLoading > 0) {
        document.getElementById('loading').style.display = 'block';
    }
});

// Hide loading indicator when tiles finish loading
wmsSource.on('tileloadend', function() {
    tilesLoading--;
    if (tilesLoading === 0) {
        document.getElementById('loading').style.display = 'none';
    }
});

// Hide loading indicator if tile loading fails
wmsSource.on('tileloaderror', function() {
    tilesLoading--;
    if (tilesLoading === 0) {
        document.getElementById('loading').style.display = 'none';
    }
});

// Initialize the OpenLayers map
const map = new ol.Map({
    target: 'map',  // HTML element ID where map will be rendered
    layers: [
        // Base layer - OpenStreetMap (free tile service)
        // Provides the background map with streets, buildings, etc.
        osmLayer,
        
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

/**
 * Display feature information in the info panel
 * @param {Object} data - GeoJSON FeatureCollection from GetFeatureInfo response
 */
function displayFeatureInfo(data) {
    const infoDiv = document.getElementById('feature-info');
    const contentDiv = document.getElementById('info-content');
    
    // Check if any features were found at the clicked location
    if (data.features && data.features.length > 0) {
        let html = '';
        
        // Add summary at the top if multiple features
        if (data.features.length > 1) {
            html += `<p style="margin-bottom: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px; font-weight: 600;">
                Found ${data.features.length} features at this location
            </p>`;
        }
        
        // Loop through ALL features, not just the first one
        data.features.forEach((feature, index) => {
            const properties = feature.properties;
            
            // Add a separator between features if there are multiple
            if (index > 0) {
                html += '<hr style="margin: 15px 0; border: 1px solid #ddd;">';
            }
            
            // Add feature number if multiple features
            if (data.features.length > 1) {
                html += `<h4 style="margin-bottom: 10px; color: #667eea;">Feature ${index + 1}</h4>`;
            }
            
            // Build HTML table to display all properties
            html += '<table>';
            for (let key in properties) {
                // Skip null or undefined values
                if (properties[key] !== null && properties[key] !== undefined) {
                    // Create a row for each property (attribute)
                    html += `<tr><th>${key}</th><td>${properties[key]}</td></tr>`;
                }
            }
            html += '</table>';
        });
        
        // Insert all feature tables into content div
        contentDiv.innerHTML = html;
        // Show the info panel by adding 'active' class
        infoDiv.classList.add('active');
    } else {
        // No features found at clicked location
        contentDiv.innerHTML = '<p>No features found at this location.</p>';
        infoDiv.classList.add('active');
    }
}

/**
 * Map Click Event Handler for GetFeatureInfo
 * Triggered when user clicks anywhere on the map
 */
map.on('singleclick', function(evt) {
    // Get current map resolution for GetFeatureInfo request
    const viewResolution = map.getView().getResolution();
    
    // Build GetFeatureInfo URL from WMS source
    // evt.coordinate: clicked point in map coordinates
    // viewResolution: current zoom level resolution
    // 'EPSG:3857': map projection (Web Mercator)
    // INFO_FORMAT: request JSON response format
    const url = wmsSource.getFeatureInfoUrl(
        evt.coordinate,
        viewResolution,
        'EPSG:3857',
        {
            'INFO_FORMAT': 'application/json',  // Request JSON format (easier to parse)
            'FEATURE_COUNT': 50  // Get up to 50 features (default is usually 1)
        }
    );
    
    // If URL was successfully generated
    if (url) {
        // Show loading message while fetching data
        document.getElementById('info-content').innerHTML = '<p>Loading...</p>';
        document.getElementById('feature-info').classList.add('active');
        
        // Make HTTP request to GeoServer GetFeatureInfo endpoint
        fetch(url)
            .then(response => {
                // Check if response is successful (status 200)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Parse JSON response
                return response.json();
            })
            .then(data => {
                // Display the feature information
                displayFeatureInfo(data);
            })
            .catch(error => {
                // Handle errors (network issues, server errors, etc.)
                document.getElementById('info-content').innerHTML = 
                    '<p style="color:red;">Error loading feature information.</p>';
                console.error('GetFeatureInfo Error:', error);
            });
    }
});

/**
 * Change cursor to pointer when hovering over WMS layer
 * Provides visual feedback that features are clickable
 */
map.on('pointermove', function(evt) {
    if (evt.dragging) {
        return; // Don't change cursor while dragging
    }
    
    // Check if mouse is over the WMS layer
    const pixel = map.getEventPixel(evt.originalEvent);
    const hit = map.forEachLayerAtPixel(pixel, function(layer) {
        return layer === wmsLayer; // Only check WMS layer
    });
    
    // Change cursor style: pointer over features, default otherwise
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

/**
 * Layer Control Panel Functionality
 * Toggle layer visibility based on checkbox state
 */

// OSM Layer toggle
document.getElementById('osm-toggle').addEventListener('change', function(e) {
    osmLayer.setVisible(e.target.checked);
});

// WMS Layer toggle
document.getElementById('wms-toggle').addEventListener('change', function(e) {
    wmsLayer.setVisible(e.target.checked);
});
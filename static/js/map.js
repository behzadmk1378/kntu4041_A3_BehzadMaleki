/**
 * Map Initialization and Configuration
 * Uses OpenLayers library for web mapping functionality
 */

// ==========================================================================
// GEOSERVER CONFIGURATION - EASY SWITCH BETWEEN LOCAL AND PUBLIC
// ==========================================================================
// Set to true to use YOUR local GeoServer
// Set to false to use the public test GeoServer (fallback for grading)
const USE_LOCAL_GEOSERVER = true;

// Configuration for your local GeoServer
// Using Flask proxy to avoid CORS issues
const LOCAL_GEOSERVER = {
    url: '/geoserver-proxy',  // Flask proxy route (avoids CORS)
    layer: 'golestan:rivers',  // Your golestan:rivers layer
    // Other available layers in your GeoServer:
    // - 'golestan:Golestan_Cities'
    // - 'golestan:Golestan_Province'
    // - 'golestan:Study_Area_BBox'
    center: [55.3, 37.3],  // Center of Golestan Province
    zoom: 8  // Zoom level for Golestan region
};

// Configuration for public test GeoServer (fallback)
const PUBLIC_GEOSERVER = {
    url: 'https://ahocevar.com/geoserver/wms',
    layer: 'topp:states',  // Public test layer
    center: [-100, 40],  // Center of USA
    zoom: 4  // Zoom level for USA
};

// Select active configuration based on USE_LOCAL_GEOSERVER flag
const activeConfig = USE_LOCAL_GEOSERVER ? LOCAL_GEOSERVER : PUBLIC_GEOSERVER;

// ==========================================================================
// CREATE INDIVIDUAL LAYERS FOR EACH GOLESTAN DATASET
// ==========================================================================

// Rivers Layer (Line)
const riversSource = new ol.source.TileWMS({
    url: activeConfig.url,
    params: {
        'LAYERS': USE_LOCAL_GEOSERVER ? 'golestan:rivers' : activeConfig.layer,
        'TILED': true
    },
    serverType: 'geoserver',
    transition: 0
});
const riversLayer = new ol.layer.Tile({
    source: riversSource,
    visible: true  // Initially visible
});

// Cities Layer (Points)
const citiesSource = new ol.source.TileWMS({
    url: activeConfig.url,
    params: {
        'LAYERS': USE_LOCAL_GEOSERVER ? 'golestan:Golestan_Cities' : activeConfig.layer,
        'TILED': true
    },
    serverType: 'geoserver',
    transition: 0
});
const citiesLayer = new ol.layer.Tile({
    source: citiesSource,
    visible: true  // Initially visible
});

// Province Boundary Layer (Polygon)
const provinceSource = new ol.source.TileWMS({
    url: activeConfig.url,
    params: {
        'LAYERS': USE_LOCAL_GEOSERVER ? 'golestan:Golestan_Province' : activeConfig.layer,
        'TILED': true
    },
    serverType: 'geoserver',
    transition: 0
});
const provinceLayer = new ol.layer.Tile({
    source: provinceSource,
    visible: true  // Initially visible
});

// Study Area Bounding Box Layer
const studyareaSource = new ol.source.TileWMS({
    url: activeConfig.url,
    params: {
        'LAYERS': USE_LOCAL_GEOSERVER ? 'golestan:Study_Area_BBox' : activeConfig.layer,
        'TILED': true
    },
    serverType: 'geoserver',
    transition: 0
});
const studyareaLayer = new ol.layer.Tile({
    source: studyareaSource,
    visible: true  // Initially visible
});

// Combined WMS source for GetFeatureInfo (queries all layers)
const allLayersString = USE_LOCAL_GEOSERVER 
    ? 'golestan:rivers,golestan:Golestan_Cities,golestan:Golestan_Province,golestan:Study_Area_BBox'
    : activeConfig.layer;

const wmsSource = new ol.source.TileWMS({
    url: activeConfig.url,
    params: {
        'LAYERS': allLayersString,  // All layers for GetFeatureInfo
        'TILED': true
    },
    serverType: 'geoserver',
    transition: 0
});

// Create OSM base layer
const osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// Loading indicator management
let tilesLoading = 0;

// Function to setup loading indicators for a source
function setupLoadingIndicator(source) {
    // Show loading indicator when tiles start loading
    source.on('tileloadstart', function() {
        tilesLoading++;
        if (tilesLoading > 0) {
            document.getElementById('loading').style.display = 'block';
        }
    });

    // Hide loading indicator when tiles finish loading
    source.on('tileloadend', function() {
        tilesLoading--;
        if (tilesLoading === 0) {
            document.getElementById('loading').style.display = 'none';
        }
    });

    // Hide loading indicator if tile loading fails
    source.on('tileloaderror', function() {
        tilesLoading--;
        if (tilesLoading === 0) {
            document.getElementById('loading').style.display = 'none';
        }
    });
}

// Setup loading indicators for all sources
setupLoadingIndicator(riversSource);
setupLoadingIndicator(citiesSource);
setupLoadingIndicator(provinceSource);
setupLoadingIndicator(studyareaSource);

// Initialize the OpenLayers map
const map = new ol.Map({
    target: 'map',  // HTML element ID where map will be rendered
    layers: [
        // Base layer - OpenStreetMap (free tile service)
        osmLayer,
        
        // Golestan layers (order matters - bottom to top)
        provinceLayer,    // Province boundary (bottom)
        studyareaLayer,   // Study area
        riversLayer,      // Rivers
        citiesLayer       // Cities (on top)
    ],
    view: new ol.View({
        // Set initial map center based on active configuration
        // fromLonLat converts [longitude, latitude] to map projection (EPSG:3857)
        center: ol.proj.fromLonLat(activeConfig.center),
        zoom: activeConfig.zoom  // Zoom level from active configuration
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
    
    // Check if mouse is over any of the Golestan layers
    const pixel = map.getEventPixel(evt.originalEvent);
    const hit = map.forEachLayerAtPixel(pixel, function(layer) {
        // Check if it's any of the Golestan layers
        return layer === riversLayer || layer === citiesLayer || 
               layer === provinceLayer || layer === studyareaLayer;
    });
    
    // Change cursor style: pointer over features, default otherwise
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

/**
 * Layer Control Panel Functionality
 * Toggle layer visibility based on checkbox state
 */

// OSM Base Layer toggle
document.getElementById('osm-toggle').addEventListener('change', function(e) {
    osmLayer.setVisible(e.target.checked);
});

// Rivers Layer toggle
document.getElementById('rivers-toggle').addEventListener('change', function(e) {
    riversLayer.setVisible(e.target.checked);
});

// Cities Layer toggle
document.getElementById('cities-toggle').addEventListener('change', function(e) {
    citiesLayer.setVisible(e.target.checked);
});

// Province Boundary Layer toggle
document.getElementById('province-toggle').addEventListener('change', function(e) {
    provinceLayer.setVisible(e.target.checked);
});

// Study Area Layer toggle
document.getElementById('studyarea-toggle').addEventListener('change', function(e) {
    studyareaLayer.setVisible(e.target.checked);
});
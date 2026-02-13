/**
 * DYNAMIC MAP CONFIGURATION
 * Automatically loads all layers from your GeoServer workspace!
 * Add new layers to GeoServer and they appear automatically - no code changes needed!
 */

// ==========================================================================
// GEOSERVER CONFIGURATION - EASY SWITCH BETWEEN LOCAL AND PUBLIC
// ==========================================================================
const USE_LOCAL_GEOSERVER = true;

// Configuration for your local GeoServer
const LOCAL_GEOSERVER = {
    url: '/geoserver-proxy',
    workspace: 'golestan',  // Your workspace name
    center: [55.3, 37.3],
    zoom: 8
};

// Configuration for public test GeoServer (fallback)
const PUBLIC_GEOSERVER = {
    url: 'https://ahocevar.com/geoserver/wms',
    workspace: 'topp',
    center: [-100, 40],
    zoom: 4
};

const activeConfig = USE_LOCAL_GEOSERVER ? LOCAL_GEOSERVER : PUBLIC_GEOSERVER;

// ==========================================================================
// DYNAMIC LAYER MANAGEMENT
// ==========================================================================
let geoserverLayers = [];  // Will hold all dynamically loaded layers
let tilesLoading = 0;

// Create OSM base layer
const osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

// Initialize the map (layers will be added dynamically)
const map = new ol.Map({
    target: 'map',
    layers: [osmLayer],  // Start with just OSM, GeoServer layers added after loading
    view: new ol.View({
        center: ol.proj.fromLonLat(activeConfig.center),
        zoom: activeConfig.zoom
    })
});

/**
 * Format layer name for display
 * "Golestan_Cities" -> "Golestan Cities"
 */
function formatLayerName(layerName) {
    // Remove workspace prefix if present
    if (layerName.includes(':')) {
        layerName = layerName.split(':')[1];
    }
    
    // Replace underscores with spaces
    layerName = layerName.replace(/_/g, ' ');
    
    // Capitalize first letter of each word
    return layerName.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Create a WMS layer for a given layer name
 */
function createWMSLayer(layerName) {
    const fullLayerName = USE_LOCAL_GEOSERVER 
        ? `${activeConfig.workspace}:${layerName}`
        : layerName;
    
    const source = new ol.source.TileWMS({
        url: activeConfig.url,
        params: {
            'LAYERS': fullLayerName,
            'TILED': true
        },
        serverType: 'geoserver',
        transition: 0
    });
    
    // Setup loading indicators
    source.on('tileloadstart', () => {
        tilesLoading++;
        document.getElementById('loading').style.display = 'block';
    });
    
    source.on('tileloadend', () => {
        tilesLoading--;
        if (tilesLoading === 0) {
            document.getElementById('loading').style.display = 'none';
        }
    });
    
    source.on('tileloaderror', () => {
        tilesLoading--;
        if (tilesLoading === 0) {
            document.getElementById('loading').style.display = 'none';
        }
    });
    
    const layer = new ol.layer.Tile({
        source: source,
        visible: true
    });
    
    layer.set('layerName', fullLayerName);  // Store layer name for reference
    layer.set('displayName', formatLayerName(layerName));
    
    return layer;
}

/**
 * Update map layer order based on panel order
 */
function updateLayerOrder() {
    // Get all layer items from the panel in current order
    const layerItems = document.querySelectorAll('.layer-item[data-layer-index]');
    
    // Reorder layers in map (bottom to top)
    geoserverLayers.forEach(layer => map.removeLayer(layer));
    
    // Add layers back in reverse order (panel top = map top)
    for (let i = layerItems.length - 1; i >= 0; i--) {
        const index = parseInt(layerItems[i].dataset.layerIndex);
        map.addLayer(geoserverLayers[index]);
    }
}

/**
 * Move layer up in the panel (and map)
 */
function moveLayerUp(layerItem) {
    const prev = layerItem.previousElementSibling;
    if (prev && prev.classList.contains('layer-item') && prev.dataset.layerIndex !== undefined) {
        layerItem.parentNode.insertBefore(layerItem, prev);
        updateLayerOrder();
    }
}

/**
 * Move layer down in the panel (and map)
 */
function moveLayerDown(layerItem) {
    const next = layerItem.nextElementSibling;
    if (next && next.classList.contains('layer-item') && next.dataset.layerIndex !== undefined) {
        layerItem.parentNode.insertBefore(next, layerItem);
        updateLayerOrder();
    }
}

/**
 * Add a layer checkbox to the control panel with reorder controls
 */
function addLayerCheckbox(layer, index) {
    const layerList = document.querySelector('#layer-panel .layer-list');
    const displayName = layer.get('displayName');
    const checkboxId = `layer-toggle-${index}`;
    
    const layerItem = document.createElement('div');
    layerItem.className = 'layer-item';
    layerItem.dataset.layerIndex = index;  // Store index for reordering
    
    // Create main label with checkbox
    const label = document.createElement('label');
    label.style.flex = '1';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = true;
    checkbox.addEventListener('change', function(e) {
        layer.setVisible(e.target.checked);
    });
    
    const span = document.createElement('span');
    span.textContent = displayName;
    
    label.appendChild(checkbox);
    label.appendChild(span);
    layerItem.appendChild(label);
    
    // Create reorder button container
    const reorderButtons = document.createElement('div');
    reorderButtons.className = 'layer-reorder-buttons';
    reorderButtons.style.cssText = 'display: flex; flex-direction: column; gap: 2px; margin-left: 8px;';
    
    // Up button
    const upButton = document.createElement('button');
    upButton.innerHTML = '▲';
    upButton.className = 'layer-order-btn';
    upButton.title = 'Move layer up';
    upButton.style.cssText = 'font-size: 10px; padding: 2px 6px; cursor: pointer; background: #667eea; color: white; border: none; border-radius: 3px;';
    upButton.addEventListener('click', (e) => {
        e.stopPropagation();
        moveLayerUp(layerItem);
    });
    
    // Down button
    const downButton = document.createElement('button');
    downButton.innerHTML = '▼';
    downButton.className = 'layer-order-btn';
    downButton.title = 'Move layer down';
    downButton.style.cssText = 'font-size: 10px; padding: 2px 6px; cursor: pointer; background: #667eea; color: white; border: none; border-radius: 3px;';
    downButton.addEventListener('click', (e) => {
        e.stopPropagation();
        moveLayerDown(layerItem);
    });
    
    reorderButtons.appendChild(upButton);
    reorderButtons.appendChild(downButton);
    layerItem.appendChild(reorderButtons);
    
    // Style the layer item to use flexbox
    layerItem.style.cssText = 'display: flex; align-items: center; justify-content: space-between;';
    
    layerList.appendChild(layerItem);
}

/**
 * Fetch available layers from GeoServer GetCapabilities
 */
async function loadGeoServerLayers() {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'block';
    loadingDiv.textContent = 'Loading layers from GeoServer...';
    
    try {
        // For local GeoServer, get all layers from the workspace
        if (USE_LOCAL_GEOSERVER) {
            // Build GetCapabilities URL through proxy
            const capabilitiesUrl = `${activeConfig.url}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities`;
            
            const response = await fetch(capabilitiesUrl);
            const xmlText = await response.text();
            
            // Parse XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            // Extract layers from the workspace
            const layers = xmlDoc.querySelectorAll('Layer[queryable="1"] > Name');
            const workspacePrefix = `${activeConfig.workspace}:`;
            
            const layerNames = [];
            layers.forEach(nameElement => {
                const fullName = nameElement.textContent;
                // Only include layers from our workspace
                if (fullName.startsWith(workspacePrefix)) {
                    const shortName = fullName.replace(workspacePrefix, '');
                    layerNames.push(shortName);
                }
            });
            
            console.log(`Found ${layerNames.length} layers in workspace "${activeConfig.workspace}":`, layerNames);
            
            // Create layers dynamically
            layerNames.forEach((layerName, index) => {
                const layer = createWMSLayer(layerName);
                geoserverLayers.push(layer);
                map.addLayer(layer);
                addLayerCheckbox(layer, index);
            });
            
            if (layerNames.length === 0) {
                alert(`No layers found in workspace "${activeConfig.workspace}". Make sure you have published layers in GeoServer.`);
            }
            
        } else {
            // Fallback: use public GeoServer with single layer
            const layer = createWMSLayer('states');
            geoserverLayers.push(layer);
            map.addLayer(layer);
            addLayerCheckbox(layer, 0);
        }
        
    } catch (error) {
        console.error('Error loading GeoServer layers:', error);
        alert('Failed to load layers from GeoServer. Make sure GeoServer is running and accessible.');
    } finally {
        loadingDiv.style.display = 'none';
        loadingDiv.textContent = 'Loading map...';
    }
}

// ==========================================================================
// FEATURE INFO (GetFeatureInfo on click)
// ==========================================================================

function closeFeatureInfo() {
    document.getElementById('feature-info').classList.remove('active');
}

function getLayerNameFromFeature(featureId) {
    if (!featureId) return 'Unknown Layer';
    
    let layerName = featureId;
    if (layerName.includes(':')) {
        layerName = layerName.split(':')[1];
    }
    if (layerName.includes('.')) {
        layerName = layerName.split('.')[0];
    }
    
    return formatLayerName(layerName);
}

function displayFeatureInfo(data) {
    const infoDiv = document.getElementById('feature-info');
    const contentDiv = document.getElementById('info-content');
    
    if (data.features && data.features.length > 0) {
        let html = '';
        
        if (data.features.length > 1) {
            html += `<p style="margin-bottom: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px; font-weight: 600;">
                Found ${data.features.length} features at this location
            </p>`;
        }
        
        data.features.forEach((feature, index) => {
            const properties = feature.properties;
            const layerName = getLayerNameFromFeature(feature.id);
            
            if (index > 0) {
                html += '<hr style="margin: 15px 0; border: 1px solid #ddd;">';
            }
            
            html += `<h4 style="margin-bottom: 10px; color: #667eea; display: flex; align-items: center;">
                <span style="background: #667eea; color: white; padding: 2px 8px; border-radius: 3px; font-size: 0.85em; margin-right: 8px;">Layer</span>
                ${layerName}
            </h4>`;
            
            html += '<table>';
            for (let key in properties) {
                if (properties[key] !== null && properties[key] !== undefined) {
                    html += `<tr><th>${key}</th><td>${properties[key]}</td></tr>`;
                }
            }
            html += '</table>';
        });
        
        contentDiv.innerHTML = html;
        infoDiv.classList.add('active');
    } else {
        contentDiv.innerHTML = '<p>No features found at this location.</p>';
        infoDiv.classList.add('active');
    }
}

// Map click handler for GetFeatureInfo
map.on('singleclick', function(evt) {
    const viewResolution = map.getView().getResolution();
    
    // Build query for all visible layers
    const visibleLayers = geoserverLayers
        .filter(layer => layer.getVisible())
        .map(layer => layer.get('layerName'))
        .join(',');
    
    if (!visibleLayers) {
        return;  // No visible layers to query
    }
    
    // Create a temporary source for GetFeatureInfo
    const wmsSource = new ol.source.TileWMS({
        url: activeConfig.url,
        params: {
            'LAYERS': visibleLayers,
            'TILED': true
        },
        serverType: 'geoserver'
    });
    
    const url = wmsSource.getFeatureInfoUrl(
        evt.coordinate,
        viewResolution,
        'EPSG:3857',
        {
            'INFO_FORMAT': 'application/json',
            'FEATURE_COUNT': 50
        }
    );
    
    if (url) {
        document.getElementById('info-content').innerHTML = '<p>Loading...</p>';
        document.getElementById('feature-info').classList.add('active');
        
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => displayFeatureInfo(data))
            .catch(error => {
                document.getElementById('info-content').innerHTML = 
                    '<p style="color:red;">Error loading feature information.</p>';
                console.error('GetFeatureInfo Error:', error);
            });
    }
});

// Cursor feedback
map.on('pointermove', function(evt) {
    if (evt.dragging) return;
    
    const pixel = map.getEventPixel(evt.originalEvent);
    const hit = map.forEachLayerAtPixel(pixel, function(layer) {
        return geoserverLayers.includes(layer);
    });
    
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

// ==========================================================================
// LAYER CONTROL PANEL
// ==========================================================================

// OSM toggle
document.getElementById('osm-toggle').addEventListener('change', function(e) {
    osmLayer.setVisible(e.target.checked);
});

// Toggle All Layers button
let allLayersVisible = true;
document.getElementById('toggle-all-layers').addEventListener('click', function() {
    const button = this;
    allLayersVisible = !allLayersVisible;
    
    // Toggle all GeoServer layers
    geoserverLayers.forEach(layer => {
        layer.setVisible(allLayersVisible);
    });
    
    // Update all checkboxes
    const layerCheckboxes = document.querySelectorAll('.layer-item[data-layer-index] input[type="checkbox"]');
    layerCheckboxes.forEach(checkbox => {
        checkbox.checked = allLayersVisible;
    });
    
    // Update button text and icon
    if (allLayersVisible) {
        button.innerHTML = '☑ Deselect All Layers';
        button.style.background = '#667eea';
    } else {
        button.innerHTML = '☐ Select All Layers';
        button.style.background = '#999';
    }
});

// ==========================================================================
// INITIALIZE - Load layers when page loads
// ==========================================================================
window.addEventListener('load', function() {
    loadGeoServerLayers();
});

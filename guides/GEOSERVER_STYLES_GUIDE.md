# Creating and Using Custom Styles in GeoServer

This guide shows you how to apply different visualization styles to your layers (shaded relief for DEMs, classified colors for polygons, etc.).

---

## Understanding GeoServer Styles

**Styles** control how your data looks:
- **Vector layers** (points, lines, polygons): Color, size, symbols, labels
- **Raster layers** (GeoTIFF, DEM): Color ramps, shaded relief, hillshade, contours

### ⚠️ XML Namespace Requirements

**IMPORTANT**: SLD files use XML namespaces. You **MUST** declare all namespaces at the root element:

```xml
<StyledLayerDescriptor version="1.0.0" 
  xmlns="http://www.opengis.net/sld" 
  xmlns:ogc="http://www.opengis.net/ogc" 
  xmlns:xlink="http://www.w3.org/1999/xlink" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
```

**Common Error**: If you get "The prefix 'ogc' for element 'ogc:PropertyName' is not bound", you forgot to declare the `ogc` namespace.

**What each namespace does**:
- `xmlns="http://www.opengis.net/sld"` - Default SLD namespace
- `xmlns:ogc` - OGC Filter Encoding (used for `<ogc:PropertyName>`, `<ogc:Filter>`)
- `xmlns:xlink` - XLink references (used for external graphics)
- `xmlns:xsi` - XML Schema Instance (for validation)

---

## Part 1: Creating Styles in GeoServer

### Step 1: Access GeoServer Style Editor

1. **Login to GeoServer**: http://localhost:8081/geoserver
   - Username: `admin`
   - Password: `geoserver` (or your changed password)

2. **Navigate to Styles**:
   - Click **"Data"** → **"Styles"** in left menu
   - You'll see existing default styles

### Step 2: Create a New Style

Click **"Add a new style"**

#### Basic Style Information:
- **Name**: `my_style_name` (e.g., `dem_shaded_relief`)
- **Workspace**: Select `golestan` (or leave blank for global)
- **Format**: SLD 1.0.0

---

## Part 2: Style Examples

### 🗺️ Example 1: Shaded Relief for DEM (Raster)

Perfect for elevation/terrain data (GeoTIFF/DEM):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" 
  xmlns="http://www.opengis.net/sld" 
  xmlns:ogc="http://www.opengis.net/ogc" 
  xmlns:xlink="http://www.w3.org/1999/xlink" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>DEM_ShadedRelief</Name>
    <UserStyle>
      <Name>Shaded Relief with Color Ramp</Name>
      <FeatureTypeStyle>
        <Rule>
          <RasterSymbolizer>
            <!-- IMPORTANT: ColorMap MUST come BEFORE ShadedRelief -->
            <!-- Color Ramp for Elevation -->
            <ColorMap type="ramp">
              <ColorMapEntry color="#2E7D32" quantity="0" label="Low" opacity="1"/>
              <ColorMapEntry color="#66BB6A" quantity="500" label="Medium" opacity="1"/>
              <ColorMapEntry color="#FFD54F" quantity="1000" label="High" opacity="1"/>
              <ColorMapEntry color="#FF9800" quantity="1500" label="Higher" opacity="1"/>
              <ColorMapEntry color="#D84315" quantity="2000" label="Peak" opacity="1"/>
            </ColorMap>
            
            <!-- Shaded Relief (3D hillshade effect) -->
            <ShadedRelief>
              <BrightnessOnly>false</BrightnessOnly>
              <ReliefFactor>55</ReliefFactor>
            </ShadedRelief>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
```

**Adjust:**
- `quantity` values to match your elevation range
- `color` codes for different color schemes
- `ReliefFactor` (1-100) for stronger/weaker relief

**⚠️ IMPORTANT - Element Order:**
In `RasterSymbolizer`, elements MUST appear in this order:
1. `Opacity` (optional)
2. `ChannelSelection` (optional)
3. `OverlapBehavior` (optional)
4. **`ColorMap`** (optional) ← Must come BEFORE ShadedRelief!
5. `ContrastEnhancement` (optional)
6. **`ShadedRelief`** (optional) ← Must come AFTER ColorMap!
7. `ImageOutline` (optional)

Incorrect order will cause validation errors like:
```
cvc-complex-type.2.4.a: Invalid content was found starting with element 'ColorMap'
```

**TextSymbolizer Element Order:**
For text labels, elements in `TextSymbolizer` must appear in this order:
1. `Label` (required)
2. `Font` (optional)
3. `LabelPlacement` (optional)
4. **`Halo`** (optional) ← Must come BEFORE Fill!
5. **`Fill`** (optional) ← Must come AFTER Halo!
6. `Graphic` (optional)
7. `Priority` (optional)
8. `VendorOption` (optional, repeatable)

Incorrect order will cause validation errors like:
```
Invalid content was found starting with element 'Halo'. One of 'Graphic, Priority, VendorOption' is expected.
```

---

### 🎨 Example 2: Classified Color Ramp (Raster)

For continuous data (temperature, rainfall, NDVI):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" 
  xmlns="http://www.opengis.net/sld" 
  xmlns:ogc="http://www.opengis.net/ogc" 
  xmlns:xlink="http://www.w3.org/1999/xlink" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>NDVI_ColorRamp</Name>
    <UserStyle>
      <Name>NDVI Vegetation Index</Name>
      <FeatureTypeStyle>
        <Rule>
          <RasterSymbolizer>
            <ColorMap type="ramp">
              <!-- -1 to 1 NDVI range -->
              <ColorMapEntry color="#0000FF" quantity="-1" label="Water/Snow" opacity="1"/>
              <ColorMapEntry color="#8B4513" quantity="-0.2" label="Bare Soil" opacity="1"/>
              <ColorMapEntry color="#FFFF00" quantity="0.1" label="Sparse Veg" opacity="1"/>
              <ColorMapEntry color="#90EE90" quantity="0.3" label="Moderate Veg" opacity="1"/>
              <ColorMapEntry color="#228B22" quantity="0.5" label="Dense Veg" opacity="1"/>
              <ColorMapEntry color="#006400" quantity="1" label="Very Dense" opacity="1"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
```

---

### 🔵 Example 3: Simple Blue for Rivers (Vector - Lines)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" 
  xmlns="http://www.opengis.net/sld" 
  xmlns:ogc="http://www.opengis.net/ogc" 
  xmlns:xlink="http://www.w3.org/1999/xlink" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>blue_rivers</Name>
    <UserStyle>
      <Name>Blue Rivers Style</Name>
      <FeatureTypeStyle>
        <Rule>
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">#1E88E5</CssParameter>
              <CssParameter name="stroke-width">2</CssParameter>
              <CssParameter name="stroke-opacity">0.8</CssParameter>
            </Stroke>
          </LineSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
```

---

### 🔴 Example 4: Cities with Labels (Vector - Points)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" 
  xmlns="http://www.opengis.net/sld" 
  xmlns:ogc="http://www.opengis.net/ogc" 
  xmlns:xlink="http://www.w3.org/1999/xlink" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>cities_labeled</Name>
    <UserStyle>
      <Name>Cities with Labels</Name>
      <FeatureTypeStyle>
        <Rule>
          <!-- Point Symbol -->
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#FF5252</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#FFFFFF</CssParameter>
                  <CssParameter name="stroke-width">2</CssParameter>
                </Stroke>
              </Mark>
              <Size>12</Size>
            </Graphic>
          </PointSymbolizer>
          
          <!-- Text Label -->
          <TextSymbolizer>
            <Label>
              <ogc:PropertyName>CITY_NAME</ogc:PropertyName> <!-- Change to your field name -->
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">12</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.5</AnchorPointX>
                  <AnchorPointY>0.0</AnchorPointY>
                </AnchorPoint>
                <Displacement>
                  <DisplacementX>0</DisplacementX>
                  <DisplacementY>8</DisplacementY>
                </Displacement>
              </PointPlacement>
            </LabelPlacement>
            <!-- IMPORTANT: Halo MUST come BEFORE Fill in TextSymbolizer -->
            <Halo>
              <Radius>2</Radius>
              <Fill>
                <CssParameter name="fill">#000000</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#FFFFFF</CssParameter>
            </Fill>
          </TextSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
```

---

### 🟢 Example 5: Polygon with Transparency (Vector)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" 
  xmlns="http://www.opengis.net/sld" 
  xmlns:ogc="http://www.opengis.net/ogc" 
  xmlns:xlink="http://www.w3.org/1999/xlink" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>province_boundary</Name>
    <UserStyle>
      <Name>Semi-Transparent Province</Name>
      <FeatureTypeStyle>
        <Rule>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#4CAF50</CssParameter>
              <CssParameter name="fill-opacity">0.3</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#2E7D32</CssParameter>
              <CssParameter name="stroke-width">3</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
```

---

## Part 3: Applying Styles in GeoServer

### Method A: Set as Default Style (Recommended)

1. Go to **Data** → **Layers**
2. Click on your layer (e.g., `golestan:rivers`)
3. Go to **Publishing** tab
4. Under **Default Style**, select your style from dropdown
5. Click **Save**

**Benefit:** Style applies automatically in your web app!

### Method B: Add as Alternative Style

1. Same steps as above
2. Under **Alternative Styles**, click **Add** and select styles
3. Users can switch between styles

---

## Part 4: Using Styles in Your Web App

### Option 1: Automatic (Default Style)

**Current setup already works!** If you set a style as "Default" in GeoServer, it's used automatically.

No code changes needed. ✅

### Option 2: Specify Custom Style in Code

Update `map_dynamic.js` to specify a style:

```javascript
function createWMSLayer(layerName, customStyle = '') {
    const fullLayerName = USE_LOCAL_GEOSERVER 
        ? `${activeConfig.workspace}:${layerName}`
        : layerName;
    
    const params = {
        'LAYERS': fullLayerName,
        'TILED': true
    };
    
    // Add custom style if specified
    if (customStyle) {
        params['STYLES'] = customStyle;
    }
    
    const source = new ol.source.TileWMS({
        url: activeConfig.url,
        params: params,
        serverType: 'geoserver',
        transition: 0
    });
    
    // ... rest of function
}
```

Then when creating layers:

```javascript
const demLayer = createWMSLayer('elevation', 'dem_shaded_relief');
const riverLayer = createWMSLayer('rivers', 'blue_rivers');
```

---

## Part 5: Advanced - Style Definitions in Code

You can define which style to use for each layer:

```javascript
// Layer style configuration
const LAYER_STYLES = {
    'rivers': 'blue_rivers',
    'Golestan_Cities': 'cities_labeled',
    'Golestan_Province': 'province_boundary',
    'elevation': 'dem_shaded_relief',
    'NDVI': 'ndvi_color_ramp'
};

// Then in loadGeoServerLayers():
layerNames.forEach((layerName, index) => {
    const customStyle = LAYER_STYLES[layerName] || '';  // Use custom or default
    const layer = createWMSLayer(layerName, customStyle);
    // ... rest of code
});
```

---

## Part 6: Dynamic Style Switching UI

Let me create an enhanced version with style picker:

**I can add a dropdown in the layer panel to switch styles on the fly!**

Would you like me to implement this? It would look like:

```
☑ Rivers              [Blue Rivers ▼] ▲▼
☑ Elevation (DEM)     [Shaded Relief ▼] ▲▼
```

---

## Quick Reference: Style Types

| Data Type | Style Options | Use Case |
|-----------|---------------|----------|
| **DEM/Elevation** | Shaded Relief, Color Ramp, Hillshade | Terrain visualization |
| **Temperature** | Color Ramp (blue→red) | Weather/climate data |
| **NDVI** | Green gradient | Vegetation index |
| **Rivers** | Blue lines, varying width | Hydrography |
| **Cities** | Points with labels | Urban areas |
| **Polygons** | Fill + border, transparency | Administrative boundaries |

---

## Testing Your Styles

1. **In GeoServer Layer Preview:**
   - Go to **Data** → **Layer Preview**
   - Find your layer
   - Click **OpenLayers**
   - See style applied!

2. **Test different styles:**
   - Add `&styles=your_style_name` to preview URL
   - Example: `...&styles=dem_shaded_relief`

3. **In your web app:**
   - Refresh browser after setting default style
   - Layer appears with new style automatically!

---

## Common Adjustments

### Make colors brighter:
Change opacity from `0.5` to `1.0`

### Thicker lines:
Increase `stroke-width` from `1` to `3`

### Different color scheme:
Replace hex colors:
- Blue: `#1E88E5`
- Green: `#4CAF50`
- Red: `#FF5252`
- Orange: `#FF9800`

---

## Next Steps

1. **Create a style in GeoServer** using one of the examples above
2. **Apply it to a layer** as default style
3. **Refresh your web app** - see the styled layer!

**Want me to add a style switcher UI to your app?** I can create dropdowns that let users change styles dynamically!

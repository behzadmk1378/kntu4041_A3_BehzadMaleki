<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" 
  xmlns="http://www.opengis.net/sld" 
  xmlns:ogc="http://www.opengis.net/ogc" 
  xmlns:xlink="http://www.w3.org/1999/xlink" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>flood_risk_raster</Name>
    <UserStyle>
      <Name>Flood Risk - Continuous (Raster)</Name>
      <FeatureTypeStyle>
        <Rule>
          <RasterSymbolizer>
            <!-- Flood Risk Color Ramp: 4 DISTINCT COLORS matched to YOUR data (0 to 0.83) -->
            <ColorMap type="intervals">
              <ColorMapEntry color="#00FF00" quantity="0.2" label="Low Risk (0-0.2)" opacity="0.85"/>
              <ColorMapEntry color="#FFFF00" quantity="0.4" label="Medium Risk (0.2-0.4)" opacity="0.85"/>
              <ColorMapEntry color="#FF8800" quantity="0.6" label="High Risk (0.4-0.6)" opacity="0.85"/>
              <ColorMapEntry color="#FF0000" quantity="0.83" label="Extreme Risk (0.6-0.83)" opacity="0.85"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>

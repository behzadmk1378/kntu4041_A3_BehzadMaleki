<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" 
  xmlns="http://www.opengis.net/sld" 
  xmlns:ogc="http://www.opengis.net/ogc" 
  xmlns:xlink="http://www.w3.org/1999/xlink" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>lulc_worldcover</Name>
    <UserStyle>
      <Name>ESA WorldCover 100m - Land Use Land Cover</Name>
      <FeatureTypeStyle>
        <Rule>
          <RasterSymbolizer>
            <!-- WorldCover Classification Colors -->
            <ColorMap type="intervals">
              <!-- 10 = Tree cover / Forest -->
              <ColorMapEntry color="#006400" quantity="10" label="Tree Cover" opacity="0.9"/>
              
              <!-- 20 = Shrubland -->
              <ColorMapEntry color="#FFBB22" quantity="20" label="Shrubland" opacity="0.9"/>
              
              <!-- 30 = Grassland -->
              <ColorMapEntry color="#FFFF4C" quantity="30" label="Grassland" opacity="0.9"/>
              
              <!-- 40 = Cropland / Agriculture -->
              <ColorMapEntry color="#F096FF" quantity="40" label="Cropland" opacity="0.9"/>
              
              <!-- 50 = Built-up / Urban -->
              <ColorMapEntry color="#FA0000" quantity="50" label="Built-up" opacity="0.9"/>
              
              <!-- 60 = Bare / Sparse vegetation -->
              <ColorMapEntry color="#B4B4B4" quantity="60" label="Bare/Sparse" opacity="0.9"/>
              
              <!-- 70 = Snow and ice -->
              <ColorMapEntry color="#F0F0F0" quantity="70" label="Snow/Ice" opacity="0.9"/>
              
              <!-- 80 = Permanent water bodies -->
              <ColorMapEntry color="#0064C8" quantity="80" label="Water" opacity="0.9"/>
              
              <!-- 90 = Herbaceous wetland -->
              <ColorMapEntry color="#0096A0" quantity="90" label="Wetland" opacity="0.9"/>
              
              <!-- 95 = Mangroves -->
              <ColorMapEntry color="#00CF75" quantity="95" label="Mangroves" opacity="0.9"/>
              
              <!-- 100 = Moss and lichen -->
              <ColorMapEntry color="#FAE6A0" quantity="100" label="Moss/Lichen" opacity="0.9"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>

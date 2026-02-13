@echo off
echo Starting GeoServer...
echo.

cd /d C:\geoserver
"C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot\bin\java.exe" -DGEOSERVER_DATA_DIR=C:\geoserver\data_dir -jar start.jar

pause

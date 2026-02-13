# Start GeoServer Script
Write-Host "Starting GeoServer..." -ForegroundColor Green
Write-Host ""

Set-Location C:\geoserver
& "C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot\bin\java.exe" -DGEOSERVER_DATA_DIR=C:\geoserver\data_dir -jar start.jar

Read-Host "Press Enter to close"

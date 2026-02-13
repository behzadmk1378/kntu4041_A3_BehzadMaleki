# How to Start GeoServer - Quick Reference Guide

This guide shows you the easiest ways to start your GeoServer installation at `C:\geoserver`.

---

## Option 1: Batch File (Easiest - Just Double-Click) ✅ RECOMMENDED

**File:** `start_geoserver.bat` (located in your project folder)

### How to use:
1. Simply **double-click** `start_geoserver.bat` in your project folder
2. A command window will open and GeoServer will start
3. When you see "Server startup complete", it's ready
4. Open your browser and go to: **http://localhost:8081/geoserver**
5. **IMPORTANT:** Don't close the command window - GeoServer runs in it

### To stop GeoServer:
- Close the command window, or
- Press `Ctrl+C` in the window

---

## Option 2: PowerShell Script

**File:** `start_geoserver.ps1` (located in your project folder)

### How to use:
- **Method A:** Right-click the file → "Run with PowerShell"
- **Method B:** In PowerShell terminal, run:
  ```powershell
  .\start_geoserver.ps1
  ```

---

## Option 3: Terminal Command (Quickest if already in terminal)

If you already have a PowerShell terminal open:

```powershell
cd C:\geoserver; java -DGEOSERVER_DATA_DIR=C:\geoserver\data_dir -jar start.jar
```

---

## Accessing GeoServer

Once started, GeoServer is available at:

**URL:** http://localhost:8081/geoserver

**Default Login Credentials:**
- **Username:** `admin`
- **Password:** `geoserver`

**IMPORTANT:** Change the default password after first login for security!

---

## Troubleshooting

### Problem: "Port already in use" error

**Solution 1:** Check if GeoServer is already running
```powershell
netstat -ano | findstr :8081
```

If you see output, GeoServer is already running. Just open http://localhost:8081/geoserver

**Solution 2:** Stop the existing process
- Find the process ID (PID) from the netstat command (last column)
- Stop it:
  ```powershell
  Stop-Process -Id [PID]
  ```
- Then start GeoServer again

### Problem: Java not found

Make sure Java is installed. Check with:
```powershell
java -version
```

If not found, download and install Java JDK 11 or newer.

---

## What Happens When You Start GeoServer?

The startup scripts do the following:

1. **Change to GeoServer directory:** `cd C:\geoserver`
2. **Run Java with GeoServer:** 
   - Uses your installed Java at: `C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot`
   - Sets data directory: `-DGEOSERVER_DATA_DIR=C:\geoserver\data_dir`
   - Starts the server: `-jar start.jar`
3. **Server starts on port 8081** (not the default 8080)

You'll see startup messages in the console window. When you see:
```
Server startup in [XXXX] milliseconds
```

Your GeoServer is ready to use!

---

## Quick Start Checklist

1. ✅ Double-click `start_geoserver.bat`
2. ✅ Wait for "Server startup complete" message
3. ✅ Open browser → http://localhost:8081/geoserver
4. ✅ Login with admin/geoserver
5. ✅ Start working with your GIS data!

---

## Next Steps

After starting GeoServer:
- Follow the main **GEOSERVER_SETUP_GUIDE.md** to configure your first workspace and layers
- Create data stores for your shapefiles or databases
- Publish layers and integrate them with your Flask application

---

**Remember:** Keep the command window open while using GeoServer. GeoServer stops when you close the window!
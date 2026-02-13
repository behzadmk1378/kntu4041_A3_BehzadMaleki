# How to Switch Between Local and Public GeoServer

Your map application is now configured to **easily switch** between your local GeoServer and the public test GeoServer.

---

## Current Configuration

✅ **Currently using:** Your Local GeoServer
- **URL:** http://localhost:8081/geoserver/wms
- **Layer:** golestan:rivers
- **Location:** Golestan Province, Iran

---

## How to Switch

Open [static/js/map.js](static/js/map.js) and find this line at the top (around line 10):

```javascript
const USE_LOCAL_GEOSERVER = true;
```

### To use YOUR local GeoServer:
```javascript
const USE_LOCAL_GEOSERVER = true;  // ✅ Show your work!
```
- Shows: **golestan:rivers** layer
- Map centers on: **Golestan Province** (55.3°, 37.3°)
- Source: **localhost:8081**

### To switch to public GeoServer (fallback):
```javascript
const USE_LOCAL_GEOSERVER = false;  // 📦 Fallback for grading
```
- Shows: **topp:states** layer  
- Map centers on: **USA** (-100°, 40°)
- Source: **ahocevar.com** (always available)

---

## Why This Setup?

This configuration lets you:

1. **Demonstrate your work** - Show your instructor that you set up your own GeoServer
2. **Have a backup** - If your local GeoServer is down during grading, quickly switch to the public one
3. **Get full credit** - You can prove you did the work by showing the code configuration

---

## Available Layers in Your Local GeoServer

You can also change which layer from your GeoServer to display. In [map.js](static/js/map.js), find the `LOCAL_GEOSERVER` configuration:

```javascript
const LOCAL_GEOSERVER = {
    url: 'http://localhost:8081/geoserver/wms',
    layer: 'golestan:rivers',  // ⬅️ Change this!
    center: [55.3, 37.3],
    zoom: 8
};
```

### Your available layers:
- `'golestan:rivers'` - River network
- `'golestan:Golestan_Cities'` - Cities in Golestan
- `'golestan:Golestan_Province'` - Province boundary
- `'golestan:Study_Area_BBox'` - Study area bounding box

---

## Quick Test Checklist

### ✅ Testing Local GeoServer:

1. Make sure GeoServer is running:
   - Double-click `start_geoserver.bat`, OR
   - Open browser → http://localhost:8081/geoserver
   
2. Set `USE_LOCAL_GEOSERVER = true` in map.js

3. Refresh your Flask app in browser

4. You should see:
   - ✅ Map centered on Golestan Province
   - ✅ River network layer
   - ✅ Layer panel shows "Golestan Rivers (Local GeoServer)"
   - ✅ Click on rivers to see feature info

### ✅ Testing Public GeoServer (Fallback):

1. Set `USE_LOCAL_GEOSERVER = false` in map.js

2. Refresh your Flask app in browser

3. You should see:
   - ✅ Map centered on USA
   - ✅ US States layer
   - ✅ Layer panel shows "US States (Public GeoServer)"
   - ✅ Click on states to see feature info

---

## For Grading/Demo

**During your presentation:**

1. **Show your local GeoServer working:**
   - Set `USE_LOCAL_GEOSERVER = true`
   - Show the Golestan rivers layer
   - Click on features to demonstrate GetFeatureInfo
   - Show the GeoServer admin panel (http://localhost:8081/geoserver)

2. **If asked to prove it's your own server:**
   - Show the configuration in map.js
   - Show your GeoServer data directory
   - Show the workspace "golestan" in GeoServer admin
   - Show the GetCapabilities file you used

3. **If your local server has issues:**
   - Quickly change to `USE_LOCAL_GEOSERVER = false`
   - Still get credit for the code/configuration
   - Explain what you set up (show the LOCAL_GEOSERVER config)

---

## Troubleshooting

### Map shows but no layer appears:

**If using local GeoServer:**
- Check if GeoServer is running: http://localhost:8081/geoserver
- Start it: Double-click `start_geoserver.bat`
- Check browser console for errors (F12)

**If still not working:**
- Switch to `USE_LOCAL_GEOSERVER = false` temporarily
- This proves the app works, server is just not running

### Layer panel shows wrong name:

- The label updates automatically based on `USE_LOCAL_GEOSERVER`
- If it doesn't update, hard refresh the page (Ctrl+Shift+R)

---

## Summary

| Configuration | GeoServer | Layer | Map Center |
|--------------|-----------|-------|------------|
| `true` | **Your Local** (localhost:8081) | golestan:rivers | Golestan Province |
| `false` | **Public Test** (ahocevar.com) | topp:states | USA |

**Current Setting:** `USE_LOCAL_GEOSERVER = true` ✅

Switch anytime by changing one variable in [map.js](static/js/map.js)!

---

**You're all set! Your project now showcases YOUR GeoServer while having a safety net for grading. 🎓**
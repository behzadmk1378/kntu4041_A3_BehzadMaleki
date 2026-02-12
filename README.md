# WebGIS Application with Flask & OpenLayers

A full-featured WebGIS application built with Flask backend and OpenLayers frontend, featuring user authentication, interactive maps, and WMS layer integration with GetFeatureInfo functionality.

![Python](https://img.shields.io/badge/Python-3.14-blue)
![Flask](https://img.shields.io/badge/Flask-3.1.2-green)
![OpenLayers](https://img.shields.io/badge/OpenLayers-7.3.0-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Configuration](#-configuration)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### Authentication System
- **User Registration**: Create new accounts with email validation
- **Secure Login**: Session-based authentication with cookies
- **Password Validation**: Password confirmation and matching checks
- **Protected Routes**: Map page only accessible to authenticated users
- **Session Management**: 1-hour session timeout with automatic logout

### Interactive Map
- **OpenStreetMap Base Layer**: Free, high-quality base map
- **WMS Layer Integration**: Display layers from GeoServer
- **GetFeatureInfo**: Click on map features to view attributes
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading Indicators**: Visual feedback during data loading
- **Interactive Cursor**: Pointer cursor over clickable features

### User Interface
- **Modern Design**: Clean, professional interface with gradient backgrounds
- **Responsive Layout**: Mobile-friendly design
- **Error Handling**: User-friendly error messages
- **Success Notifications**: Feedback for successful actions
- **Attribute Display**: Feature properties shown in formatted tables

---

## 🎬 Demo

### Login Page
The application starts with a secure login page featuring a modern purple gradient design.

### Registration
New users can easily register with username, email, and password.

### Interactive Map
Once logged in, users can:
- Pan and zoom the map
- View WMS layers from GeoServer
- Click on features to see attributes
- Access feature information in a clean panel

---

## 🚀 Installation

### Prerequisites
- Python 3.10 or higher
- pip (Python package manager)
- Web browser (Chrome, Firefox, Edge, Safari)

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd kntu4041_A3_BehzadMaleki
```

### Step 2: Create Virtual Environment
```bash
# Windows
python -m venv flaskvenv
flaskvenv\Scripts\activate

# Mac/Linux
python3 -m venv flaskvenv
source flaskvenv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run the Application
```bash
python app.py
```

The application will start on `http://127.0.0.1:5000`

---

## 💻 Usage

### First Time Setup

1. **Start the Server**
   ```bash
   python app.py
   ```

2. **Open Your Browser**
   Navigate to: `http://127.0.0.1:5000`

3. **Register an Account**
   - Click "Register here"
   - Fill in: username, email, password, confirm password
   - Click "Register"

4. **Login**
   - Enter your username and password
   - Click "Login"

5. **Explore the Map**
   - Pan by clicking and dragging
   - Zoom with mouse wheel or +/- buttons
   - Click on US states to view information
   - Close info panel with × button
   - Logout with top-right button

### Testing Authentication
Visit `/debug` endpoint to check session and cookie status:
```
http://127.0.0.1:5000/debug
```

---

## 📁 Project Structure

```
kntu4041_A3_BehzadMaleki/
│
├── app.py                      # Flask application (main backend)
├── requirements.txt            # Python dependencies
├── .gitignore                  # Git ignore rules
├── README.md                   # Project overview
├── FLASK_GUIDE.md             # Flask learning guide
├── PROJECT_GUIDE.md           # Step-by-step implementation guide
├── PROJECT_README.md          # This file (detailed documentation)
│
├── templates/                  # HTML templates (Jinja2)
│   ├── login.html             # Login page
│   ├── register.html          # Registration page
│   └── map.html               # Protected map page
│
└── static/                     # Static files
    ├── css/
    │   └── style.css          # All application styles
    └── js/
        └── map.js             # OpenLayers map logic
```

---

## 🛠 Technologies Used

### Backend
- **Flask 3.1.2**: Python web framework
- **Werkzeug 3.1.5**: WSGI utilities and security
- **Jinja2 3.1.6**: Template engine
- **Python 3.14**: Programming language

### Frontend
- **HTML5**: Page structure
- **CSS3**: Styling and responsive design
- **JavaScript (ES6+)**: Interactive functionality
- **OpenLayers 7.3.0**: Web mapping library

### Data Sources
- **OpenStreetMap**: Base map tiles
- **GeoServer WMS**: Vector data layers
- **Public GeoServer**: Demo data (topp:states)

---

## ⚙️ Configuration

### Using Your Own GeoServer

Edit `static/js/map.js`:

```javascript
const wmsSource = new ol.source.TileWMS({
    url: 'http://your-geoserver-url:8080/geoserver/wms',
    params: {
        'LAYERS': 'your_workspace:your_layer',
        'TILED': true
    },
    serverType: 'geoserver'
});
```

Update map center and zoom in `static/js/map.js`:

```javascript
view: new ol.View({
    center: ol.proj.fromLonLat([longitude, latitude]),
    zoom: zoom_level
})
```

### Environment Variables

For production, set these environment variables:

```bash
# Flask configuration
export FLASK_ENV=production
export FLASK_SECRET_KEY=your-secret-key-here

# Debug mode
export FLASK_DEBUG=0
```

---

## 🔌 API Endpoints

### Public Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Redirects to login |
| GET/POST | `/login` | Login page and authentication |
| GET/POST | `/register` | Registration page and user creation |

### Protected Routes (Require Authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/map` | Interactive map page |
| GET | `/logout` | Logout and clear session |
| GET | `/debug` | Debug session/cookie info (dev only) |

### Route Details

#### POST `/login`
**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Response:** Redirect to `/map` with session cookie

#### POST `/register`
**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirm_password": "string"
}
```
**Response:** Redirect to `/login` with success message

---

## 📸 Screenshots

### Login Page
- Modern purple gradient background
- Clean white form box
- Error/success message display
- Link to registration

### Registration Page
- All required fields with validation
- Password confirmation
- Duplicate username checking
- Link back to login

### Map Interface
- Full-screen interactive map
- Header with username and logout
- Feature info panel (bottom-right)
- WMS layer overlay on OSM base

### Feature Info Panel
- Attribute table display
- Close button
- Scrollable content
- Professional styling

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Flask Server Won't Start
```bash
# Check if port 5000 is already in use
# Windows:
netstat -ano | findstr :5000

# Mac/Linux:
lsof -i :5000

# Kill the process or use a different port
export FLASK_RUN_PORT=5001
python app.py
```

#### 2. Module Not Found Error
```bash
# Ensure virtual environment is activated
# Windows:
flaskvenv\Scripts\activate

# Mac/Linux:
source flaskvenv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

#### 3. Map Not Loading
- Check browser console for errors (F12)
- Verify internet connection (CDN resources)
- Check GeoServer URL is accessible
- Verify CORS is enabled on GeoServer

#### 4. GetFeatureInfo Not Working
- Ensure clicking on actual features (not empty space)
- Check browser Network tab for WMS requests
- Verify GeoServer supports GetFeatureInfo
- Check INFO_FORMAT is supported (application/json)

#### 5. Session/Cookie Issues
- Clear browser cookies for localhost
- Check browser allows cookies
- Verify `app.secret_key` is set
- Use browser DevTools > Application > Cookies

#### 6. Python Version Compatibility
```bash
# Check Python version
python --version

# If version is too old, upgrade or use pyenv
# Windows: Download from python.org
# Mac: brew install python@3.14
# Linux: apt install python3.14
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit Your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Write clean, commented code
- Follow PEP 8 style guide for Python
- Test all features before submitting
- Update documentation as needed

---

## 🔒 Security Considerations

### Current Implementation (Development)
⚠️ **Warning**: This is a development version with simplified security.

**Known Limitations:**
- Passwords stored in plain text (in-memory dictionary)
- No database persistence
- Simple session management
- Debug routes exposed

### Production Recommendations

1. **Hash Passwords**
   ```python
   from werkzeug.security import generate_password_hash, check_password_hash
   
   # When registering
   hashed_password = generate_password_hash(password)
   
   # When logging in
   check_password_hash(stored_hash, password)
   ```

2. **Use a Database**
   - SQLite for small projects
   - PostgreSQL for production
   - MongoDB for NoSQL approach

3. **Secure Secret Key**
   ```python
   import os
   app.secret_key = os.environ.get('SECRET_KEY')
   ```

4. **Remove Debug Routes**
   - Delete or protect the `/debug` endpoint
   - Set `debug=False` in production

5. **HTTPS Only**
   - Use SSL certificates
   - Set secure cookie flags
   - Enable HSTS headers

6. **Rate Limiting**
   - Implement Flask-Limiter
   - Prevent brute force attacks

---

## 📚 Learning Resources

- **Flask Documentation**: https://flask.palletsprojects.com/
- **OpenLayers Documentation**: https://openlayers.org/en/latest/apidoc/
- **GeoServer Documentation**: https://docs.geoserver.org/
- **WMS Specification**: https://www.ogc.org/standards/wms

---

## 🎓 Academic Context

This project was developed as part of the **WebGIS Course** at K.N. Toosi University of Technology.

**Assignment**: Final Project (50% of TA evaluation)  
**Course**: Web GIS  
**Student**: Behzad Maleki  
**Student ID**: kntu4041  
**Assignment**: A3

---

## 📝 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2026 Behzad Maleki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Contact

**Behzad Maleki**  
Student ID: kntu4041  
K.N. Toosi University of Technology

**Project Repository**: [GitHub Repository Link]  
**Live Demo**: [If deployed, add URL here]

---

## 🙏 Acknowledgments

- **OpenStreetMap Contributors** for base map data
- **GeoServer Community** for the open-source GIS server
- **OpenLayers Team** for the excellent web mapping library
- **Flask Community** for the lightweight web framework
- **K.N. Toosi University of Technology** for the course and guidance

---

## 📈 Future Enhancements

Potential improvements for future versions:

- [ ] Database integration (PostgreSQL/SQLite)
- [ ] Password hashing and security improvements
- [ ] User profile management
- [ ] Multiple WMS layer support with layer switcher
- [ ] Drawing and measurement tools
- [ ] Export map to PDF/PNG
- [ ] Search functionality (geocoding)
- [ ] Admin dashboard for user management
- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] Remember me checkbox
- [ ] Map bookmarks/favorites
- [ ] Custom styling for WMS layers
- [ ] Integration with other GIS services (WFS, WCS)

---

## 📊 Version History

### v1.0.0 (February 2026)
- Initial release
- User authentication system
- Interactive map with OpenLayers
- WMS layer integration
- GetFeatureInfo functionality
- Responsive design
- Loading indicators
- Debug tools

---

**Last Updated**: February 12, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready (with security recommendations)

---

*This project demonstrates modern web development practices combining backend Python/Flask with frontend JavaScript mapping libraries to create a functional WebGIS application.*

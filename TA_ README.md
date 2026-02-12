# WebGIS Course - Final Project

**Project Weight**: This final project represents **50%** of your final TA (Teaching Assistant) evaluation score.

**Important**: Flask concepts will be covered in the final exam. You are expected to learn Flask independently for this project.

**Submission**: Submit the link to your forked repository in the VC (Virtual Classroom).

---

## Table of Contents

1. [Overview](#overview)
2. [Project Requirements](#project-requirements)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Submission Guidelines](#submission-guidelines)
6. [Resources](#resources)

---

## Overview

Build a WebGIS application with:

- Flask backend
- HTML, CSS, JavaScript frontend
- User authentication (login, register)
- Protected map page (cookie-based)
- WMS layer from GeoServer displayed on map
- GetFeatureInfo functionality (click on WMS layer to see attributes)

---

## Project Requirements

### 1. User Authentication

- Login page
- Registration page
- Cookie-based authentication in Flask
- Protected routes

### 2. Map Page (Protected)

- Only accessible when logged in
- Display WMS layer from GeoServer
- GetFeatureInfo: Click on WMS layer → show attribute table in a div on map
- Base map layer (OSM or similar)

### 3. Application Structure

- Flask backend with proper routing
- Clean, responsive design
- Error handling

---

**Note:** Learn Flask independently. See `FLASK_GUIDE.md` for detailed tutorial.

---

## Project Structure

```
your-project/
│
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies (Flask==2.3.0)
├── README.md             # Your project documentation
│
├── templates/            # HTML templates
│   ├── login.html
│   ├── register.html
│   └── map.html
│
├── static/              # Static files
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── map.js
│
└── .gitignore
```

---

## Getting Started

1. Fork this repository
2. Clone your fork
3. Create virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Mac/Linux
   ```
4. Install Flask:
   ```bash
   pip install Flask
   ```
5. Create project structure (templates/, static/css/, static/js/)
6. Learn Flask (see `FLASK_GUIDE.md`)
7. Start building your application

---

## Required Features

**Login page:**

- Username and password form
- Submit to Flask backend
- Show error messages
- Link to register page

**Register page:**

- Username, email, password, confirm password
- Form validation
- Submit to Flask backend
- Link to login page

**Map page:**

- OpenLayers map initialization
- Base layer (OSM)
- WMS layer from GeoServer
- Click event handler for GetFeatureInfo
- Div to display attribute table
- Logout button

**GetFeatureInfo:**

- Click on WMS layer
- Make GetFeatureInfo request to GeoServer
- Parse response (XML/JSON)
- Display attributes in div on map

---

## Submission Guidelines

### Required Deliverables

1. **Complete working application**

   - All pages functional
   - Authentication working
   - Map with WMS layer
   - GetFeatureInfo working

2. **README.md** (your own documentation)

   - Setup instructions
   - How to run
   - GeoServer WMS URL and layer info
   - Screenshots/demo

### Submission Steps

1. Complete all features
2. Test thoroughly
3. Write README
4. Commit and push to your fork
5. Submit repository link in VC

### Important Notes

- **AI Tools Allowed**: You may use AI tools, but understand your code
- **Flask on Final Exam**: Flask will be tested - learn it properly
- **Functionality**: Must be fully working

---

**Good luck!**

# Import necessary Flask modules for web application functionality
from flask import Flask, render_template, request, redirect, url_for, session, make_response
import secrets  # For generating secure random tokens

# Initialize Flask application
app = Flask(__name__)
# Generate a secure secret key for session management (required for cookies/sessions)
app.secret_key = secrets.token_hex(16)

# In-memory user storage dictionary (for development only)
# In production, use a proper database like SQLite, PostgreSQL, or MongoDB
# Structure: {'username': {'email': 'user@email.com', 'password': 'password123'}}
users = {}

# Route: Home page
# Redirects users to the login page
@app.route('/')
def index():
    return redirect(url_for('login'))

# Route: Login page
# Handles both GET (display form) and POST (process login) requests
@app.route('/login', methods=['GET', 'POST'])
def login():
    # Handle form submission (POST request)
    if request.method == 'POST':
        # Get form data from login form
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Validate credentials against stored users
        # In production, passwords should be hashed using bcrypt or similar
        if username in users and users[username]['password'] == password:
            # Create a session to keep user logged in
            session['username'] = username
            
            # Create response with redirect to map page
            response = make_response(redirect(url_for('map')))
            # Set a cookie that expires in 1 hour (3600 seconds)
            response.set_cookie('logged_in', 'true', max_age=3600)
            return response
        else:
            # Invalid credentials - show error message
            return render_template('login.html', error='Invalid credentials')
    
    # Handle GET request - display login form
    # Check if there's a success message from registration
    success = request.args.get('success')
    return render_template('login.html', success=success)

# Route: Registration page
# Handles both GET (display form) and POST (process registration) requests
@app.route('/register', methods=['GET', 'POST'])
def register():
    # Handle form submission (POST request)
    if request.method == 'POST':
        # Get all form data from registration form
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        # Validation: Check if all required fields are filled
        if not username or not email or not password:
            return render_template('register.html', error='All fields are required')
        
        # Validation: Ensure password and confirmation match
        if password != confirm_password:
            return render_template('register.html', error='Passwords do not match')
        
        # Validation: Check if username is already taken
        if username in users:
            return render_template('register.html', error='Username already exists')
        
        # All validations passed - store new user
        # WARNING: In production, ALWAYS hash passwords using bcrypt or argon2
        # Never store plain text passwords!
        users[username] = {
            'email': email,
            'password': password  # TODO: Hash this password in production!
        }
        
        # Redirect to login page with success message
        return redirect(url_for('login', success='Registration successful'))
    
    # Handle GET request - display registration form
    return render_template('register.html')

# Route: Map page (Protected)
# Only accessible to logged-in users
@app.route('/map')
def map():
    # Check if user is authenticated by looking for username in session
    if 'username' not in session:
        # Not logged in - redirect to login page
        return redirect(url_for('login'))
    
    # User is authenticated - display map page with username
    return render_template('map.html', username=session['username'])

# Route: Logout
# Clears user session and cookies, then redirects to login
@app.route('/logout')
def logout():
    # Remove username from session (logs out the user)
    session.pop('username', None)
    
    # Create redirect response to login page
    response = make_response(redirect(url_for('login')))
    # Delete the logged_in cookie
    response.delete_cookie('logged_in')
    return response

# Route: Test/Debug - Check session and cookie status
# This route helps you verify authentication is working
# WARNING: Remove or protect this route in production!
@app.route('/debug')
def debug():
    cookie_value = request.cookies.get('logged_in', 'Not set')
    session_user = session.get('username', 'Not set')
    
    return f"""
    <h2>Debug Information</h2>
    <p><strong>Session Username:</strong> {session_user}</p>
    <p><strong>Cookie 'logged_in':</strong> {cookie_value}</p>
    <p><strong>All Cookies:</strong> {request.cookies}</p>
    <p><strong>All Session Data:</strong> {dict(session)}</p>
    <br>
    <a href="{url_for('login')}">Go to Login</a> | 
    <a href="{url_for('map')}">Go to Map</a> | 
    <a href="{url_for('logout')}">Logout</a>
    """

# Run the Flask application
# debug=True enables auto-reload and detailed error messages
# WARNING: Set debug=False in production!
if __name__ == '__main__':
    app.run(debug=True)

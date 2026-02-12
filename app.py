from flask import Flask, render_template, request, redirect, url_for, session, make_response
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)  # Generate a secret key for sessions

# In-memory user storage (for development)
users = {}

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Check credentials
        if username in users and users[username]['password'] == password:
            # Create session
            session['username'] = username
            
            # Create response with cookie
            response = make_response(redirect(url_for('map')))
            response.set_cookie('logged_in', 'true', max_age=3600)
            return response
        else:
            return render_template('login.html', error='Invalid credentials')
    
    success = request.args.get('success')
    return render_template('login.html', success=success)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        # Validation
        if not username or not email or not password:
            return render_template('register.html', error='All fields are required')
        
        if password != confirm_password:
            return render_template('register.html', error='Passwords do not match')
        
        if username in users:
            return render_template('register.html', error='Username already exists')
        
        # Store user
        users[username] = {
            'email': email,
            'password': password  # In production, hash this!
        }
        
        return redirect(url_for('login', success='Registration successful'))
    
    return render_template('register.html')

@app.route('/map')
def map():
    # Check if user is logged in
    if 'username' not in session:
        return redirect(url_for('login'))
    
    return render_template('map.html', username=session['username'])

@app.route('/logout')
def logout():
    session.pop('username', None)
    response = make_response(redirect(url_for('login')))
    response.delete_cookie('logged_in')
    return response

if __name__ == '__main__':
    app.run(debug=True)

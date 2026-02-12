from flask import Flask, render_template, request, redirect, url_for, session, make_response
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)  # Generate a secret key for sessions

# In-memory user storage (for development)
users = {}

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

if __name__ == '__main__':
    app.run(debug=True)

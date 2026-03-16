from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
# Allow all origins so mobile browsers on the same Wi-Fi can access the API
CORS(app, resources={r"/*": {"origins": "*"}})

DB_FILE = "users.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # Create the user table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            mobile_number TEXT NOT NULL,
            email_id TEXT NOT NULL UNIQUE,
            nationality TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/register', methods=['POST'])
def register():
    try:
        # Get data from the frontend JSON payload
        data = request.json
        
        # Connect to SQLite
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Insert user data into the database
        cursor.execute('''
            INSERT INTO users (first_name, last_name, age, gender, mobile_number, email_id, nationality)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('firstName'),
            data.get('lastName'),
            data.get('age'),
            data.get('gender'),
            data.get('mobileNumber'),
            data.get('emailId'),
            data.get('nationality')
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({"message": "User registered successfully!"}), 201

    except sqlite3.IntegrityError:
        return jsonify({"message": "Error: Email ID already exists."}), 400
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    # Initialize the database file and table on startup
    init_db()

    # Bind to 0.0.0.0 so mobile devices on the same Wi-Fi network can reach the server
    print("Starting Flask server...")
    print("  Local:   http://127.0.0.1:5000")
    print("  Network: http://192.168.100.188:5000  <-- use this on your phone")
    app.run(debug=True, host='0.0.0.0', port=5000)

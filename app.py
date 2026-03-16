from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app) # Enable CORS for all routes so the frontend can communicate with it

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
    
    # Run the Flask app
    print("Starting Flask server on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)

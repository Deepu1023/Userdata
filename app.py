from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app, resources={r"/*": {"origins": "*"}})

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "users.db")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name    TEXT NOT NULL,
            last_name     TEXT NOT NULL,
            age           INTEGER NOT NULL,
            gender        TEXT NOT NULL,
            mobile_number TEXT NOT NULL,
            email_id      TEXT NOT NULL UNIQUE,
            nationality   TEXT NOT NULL,
            created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()
    print(f"Database ready at: {DB_FILE}")

# Serve index.html at the root URL
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Registration endpoint
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        if not data:
            return jsonify({"message": "No data received."}), 400

        # Validate required fields
        required = ['firstName', 'lastName', 'age', 'gender', 'mobileNumber', 'emailId', 'nationality']
        missing = [f for f in required if not data.get(f)]
        if missing:
            return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO users (first_name, last_name, age, gender, mobile_number, email_id, nationality)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('firstName'),
            data.get('lastName'),
            int(data.get('age')),
            data.get('gender'),
            data.get('mobileNumber'),
            data.get('emailId'),
            data.get('nationality')
        ))
        conn.commit()
        conn.close()

        print(f"New user registered: {data.get('firstName')} {data.get('lastName')} ({data.get('emailId')})")
        return jsonify({"message": "User registered successfully!"}), 201

    except sqlite3.IntegrityError:
        return jsonify({"message": "This email is already registered."}), 409
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# View all registered users (useful for checking saved data)
@app.route('/users', methods=['GET'])
def get_users():
    try:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users ORDER BY id DESC")
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify({"count": len(rows), "users": rows}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

if __name__ == '__main__':
    init_db()

    # Get local network IP for display
    import socket
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
    except:
        local_ip = '192.168.100.188'

    print("\n" + "="*55)
    print("  Flask Registration Server is RUNNING")
    print("="*55)
    print(f"  On this PC:    http://127.0.0.1:5000")
    print(f"  On your phone: http://{local_ip}:5000")
    print(f"  View all users: http://{local_ip}:5000/users")
    print("="*55)
    print("  NOTE: Phone must be on the SAME Wi-Fi network")
    print("="*55 + "\n")

    app.run(debug=True, host='0.0.0.0', port=5000)

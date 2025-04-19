from app import create_app
from flask_cors import CORS
from dotenv import load_dotenv

app = create_app()

# Configure CORS properly to handle preflight requests
CORS(app, 
     resources={r"/gym/v1/*": {"origins": "*"}}, 
     supports_credentials=True,
     methods=["GET", "POST", "OPTIONS"])

if __name__=="__main__":
    app.run(debug=True, host='0.0.0.0', port=8000)
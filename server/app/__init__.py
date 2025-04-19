from flask import Flask
from flask_cors import CORS

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    
    # Import routes after app creation to avoid circular imports
    from app.routes.gym_routes import gymBP
    
    # Register blueprint with proper prefix
    app.register_blueprint(gymBP, url_prefix='/gym/v1')
    
    @app.route('/')
    def home():
        return {"message": "Gym Consistency API is running"}
    
    return app

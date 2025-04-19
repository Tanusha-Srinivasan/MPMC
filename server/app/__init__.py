from flask import Flask

def create_app():
    app = Flask(__name__)
    
    # Register blueprints
    from app.routes.gym_routes import gymBP
    app.register_blueprint(gymBP)
    
    return app

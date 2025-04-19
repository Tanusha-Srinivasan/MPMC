from flask import Flask
from app.routes.gym_routes import gymBP

def create_app():
    app = Flask(__name__)

    app.register_blueprint(gymBP)

    return app
from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from app.config import Config
from flask_bcrypt import Bcrypt

# Initialize Flask extensions properly
mongo = PyMongo()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)
    app.config['MONGO_URI'] = Config.MONGO_URI
    
    # Initialize extensions with app
    mongo.init_app(app)
    bcrypt.init_app(app)
    
    # Configure CORS
    CORS(app, 
         resources={r"/*": {
             "origins": Config.CORS_ORIGINS,
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True
         }})
    
    # Register blueprints after initialization
    from app.routes.routes import main_bp
    app.register_blueprint(main_bp, url_prefix='/api')
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'service': 'Event Hub API'}, 200
    
    return app
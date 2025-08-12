from app import create_app, mongo, bcrypt
from app.config import Config
from app.routes.routes import init_routes

# Create and configure the Flask app
app = create_app()

# Initialize routes with database connections
with app.app_context():
    init_routes(mongo, bcrypt)

if __name__ == '__main__':
    # Run with proper configuration
    print(f"""
    ========================================
    Event Hub Backend Server Starting...
    ========================================
    Server URL: http://{Config.HOST}:{Config.PORT}
    Debug Mode: {Config.DEBUG}
    MongoDB: Connected
    API Endpoints:
    - Health Check: http://{Config.HOST}:{Config.PORT}/health
    - Events Search: http://{Config.HOST}:{Config.PORT}/api/events/search
    - User Auth: http://{Config.HOST}:{Config.PORT}/api/auth/[login|register]
    ========================================
    """)
    
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )
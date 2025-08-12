import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """
    FIXED: Centralized configuration with environment variables
    """
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
    
    # MongoDB Configuration - connection string
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/eventhub')
    
    # Ticketmaster API - Use environment variable for API key
    TICKETMASTER_API_KEY = os.getenv('TICKETMASTER_API_KEY', 'rJl9LnZCTj5lHVrGDbdObgTiRRmlnSdk')
    TICKETMASTER_BASE_URL = 'https://app.ticketmaster.com/discovery/v2'
    
    # CORS Configuration
    CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000']
    
    # Server Configuration
    HOST = '0.0.0.0'
    PORT = 5000
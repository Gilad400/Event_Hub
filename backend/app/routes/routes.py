from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from app.models.user import User
from app.services.event_service import event_service

# Create blueprint
main_bp = Blueprint('main', __name__)

# Initialize user model
user_model = None

def init_routes(mongo, bcrypt):
    global user_model
    user_model = User(mongo, bcrypt)

# ============= EVENT ROUTES =============

@main_bp.route('/events/search', methods=['GET'])
@cross_origin()
def search_events():
    """
    FIXED: Enhanced event search endpoint with better error handling
    """
    try:
        # Get query parameters
        params = {
            'keyword': request.args.get('keyword'),
            'city': request.args.get('city'),
            'stateCode': request.args.get('stateCode'),
            'startDate': request.args.get('startDate'),
            'endDate': request.args.get('endDate'),
            'segment': request.args.get('segment'),
            'size': request.args.get('size', 20),
            'page': request.args.get('page', 0)
        }
        
        # Remove None values
        params = {k: v for k, v in params.items() if v is not None}
        
        # Search events
        result = event_service.search_events(**params)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        print(f"Search endpoint error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Search failed: {str(e)}'
        }), 500

@main_bp.route('/events/<event_id>', methods=['GET'])
@cross_origin()
def get_event(event_id):
    """
    FIXED: Get single event details
    """
    try:
        result = event_service.get_event_by_id(event_id)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 404
            
    except Exception as e:
        print(f"Get event endpoint error: {str(e)}") 
        return jsonify({
            'success': False,
            'error': f'Failed to get event: {str(e)}'
        }), 500

# ============= USER AUTHENTICATION ROUTES =============

@main_bp.route('/auth/register', methods=['POST'])
@cross_origin()
def register():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Extract registration data
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # Validate required fields
        if not all([username, email, password]):
            return jsonify({
                'success': False,
                'error': 'Username, email, and password are required'
            }), 400
        
        # Register user
        success, message, user_data = user_model.register(username, email, password)
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'user': user_data
            }), 201
        else:
            return jsonify({
                'success': False,
                'error': message
            }), 400
            
    except Exception as e:
        print(f"Registration endpoint error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Registration failed: {str(e)}'
        }), 500

@main_bp.route('/auth/login', methods=['POST'])
@cross_origin()
def login():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not all([email, password]):
            return jsonify({
                'success': False,
                'error': 'Email and password are required'
            }), 400
        
        # Attempt login
        success, message, user_data = user_model.login(email, password)
        
        if success:
            return jsonify({
                'success': True,
                'message': message,
                'user': user_data
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': message
            }), 401
            
    except Exception as e:
        print(f"Login endpoint error: {str(e)}") 
        return jsonify({
            'success': False,
            'error': f'Login failed: {str(e)}'
        }), 500

# ============= USER FAVORITES ROUTES =============

@main_bp.route('/users/<user_id>/favorites', methods=['GET'])
@cross_origin()
def get_favorites(user_id):
    try:
        success, message, favorites = user_model.get_user_favorites(user_id)
        
        if success:
            return jsonify({
                'success': True,
                'favorites': favorites
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': message
            }), 404
            
    except Exception as e:
        print(f"Get favorites endpoint error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to get favorites: {str(e)}'
        }), 500

@main_bp.route('/users/<user_id>/favorites', methods=['POST'])
@cross_origin()
def add_favorite(user_id):
    try:
        data = request.get_json()
        
        if not data or 'event' not in data:
            return jsonify({
                'success': False,
                'error': 'Event data is required'
            }), 400
        
        event_data = data['event']
        success, message = user_model.add_to_favorites(user_id, event_data)
        
        if success:
            return jsonify({
                'success': True,
                'message': message
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': message
            }), 400
            
    except Exception as e:
        print(f"Add favorite endpoint error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to add favorite: {str(e)}'
        }), 500

@main_bp.route('/users/<user_id>/favorites/<event_id>', methods=['DELETE'])
@cross_origin()
def remove_favorite(user_id, event_id):
    try:
        success, message = user_model.remove_from_favorites(user_id, event_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': message
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': message
            }), 400
            
    except Exception as e:
        print(f"Remove favorite endpoint error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to remove favorite: {str(e)}'
        }), 500
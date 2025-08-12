import re
from bson import ObjectId
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User:

    def __init__(self, mongo, bcrypt):
        self.mongo = mongo
        self.bcrypt = bcrypt
        self.collection = mongo.db.users
    
    def validate_email(self, email):
        email_pattern = re.compile(
            r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        )
        return bool(email_pattern.match(email))
    
    def validate_password(self, password):
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        if not re.search(r'[A-Za-z]', password):
            return False, "Password must contain at least one letter"
        if not re.search(r'\d', password):
            return False, "Password must contain at least one number"
        return True, "Valid password"
    
    def register(self, username, email, password):
        try:
            # Validate inputs
            if not all([username, email, password]):
                return False, 'All fields are required', None
            
            # Validate email format
            if not self.validate_email(email):
                return False, 'Invalid email format', None
            
            # Validate password strength
            is_valid, msg = self.validate_password(password)
            if not is_valid:
                return False, msg, None
            
            # Check for existing user
            existing_user = self.collection.find_one({
                '$or': [
                    {'email': email.lower()},
                    {'username': username.lower()}
                ]
            })
            
            if existing_user:
                if existing_user.get('email', '').lower() == email.lower():
                    return False, 'Email already registered', None
                return False, 'Username already taken', None
            
            hashed_password = self.bcrypt.generate_password_hash(password).decode('utf-8')
            
            # Create new user document
            user_doc = {
                'username': username,
                'username_lower': username.lower(), 
                'email': email.lower(),
                'password': hashed_password,
                'favorites': [],
                'created_at': datetime.utcnow(),  
                'updated_at': datetime.utcnow()  
            }
            
            result = self.collection.insert_one(user_doc)
            
            # Return user data without password
            user_data = {
                '_id': str(result.inserted_id),
                'username': username,
                'email': email.lower(),
                'favorites': []
            }
            
            return True, 'User registered successfully', user_data
            
        except Exception as e:
            print(f"Registration error: {str(e)}")
            return False, f'Registration failed: {str(e)}', None
    
    def login(self, email, password):
        try:
            # Find user by email (case-insensitive)
            user = self.collection.find_one({'email': email.lower()})
            
            if not user:
                return False, 'Invalid email or password', None
            
            # Check password hash
            if not self.bcrypt.check_password_hash(user['password'], password):
                return False, 'Invalid email or password', None
            
            # Update last login time
            self.collection.update_one(
                {'_id': user['_id']},
                {'$set': {'last_login': datetime.utcnow()}}
            )
            
            # Return user data without password
            user_data = {
                '_id': str(user['_id']),
                'username': user['username'],
                'email': user['email'],
                'favorites': user.get('favorites', [])
            }
            
            return True, 'Login successful', user_data
            
        except Exception as e:
            print(f"Login error: {str(e)}")  # Logging
            return False, f'Login failed: {str(e)}', None
    
    def add_to_favorites(self, user_id, event_data):
        try:
            if not ObjectId.is_valid(user_id):
                return False, 'Invalid user ID'
            
            # Store complete event data
            favorite_item = {
                'event_id': event_data.get('id'),
                'name': event_data.get('name'),
                'date': event_data.get('date'),
                'venue': event_data.get('venue'),
                'image': event_data.get('image'),
                'added_at': datetime.utcnow()
            }
            
            result = self.collection.update_one(
                {'_id': ObjectId(user_id)},
                {
                    '$addToSet': {'favorites': favorite_item},
                    '$set': {'updated_at': datetime.utcnow()}
                }
            )
            
            if result.modified_count:
                return True, 'Added to favorites'
            return False, 'Already in favorites or user not found'
            
        except Exception as e:
            print(f"Add favorite error: {str(e)}")
            return False, f'Failed to add favorite: {str(e)}'
    
    def remove_from_favorites(self, user_id, event_id):
        try:
            if not ObjectId.is_valid(user_id):
                return False, 'Invalid user ID'
            
            result = self.collection.update_one(
                {'_id': ObjectId(user_id)},
                {
                    '$pull': {'favorites': {'event_id': event_id}},
                    '$set': {'updated_at': datetime.utcnow()}
                }
            )
            
            if result.modified_count:
                return True, 'Removed from favorites'
            return False, 'Favorite not found or user not found'
            
        except Exception as e:
            print(f"Remove favorite error: {str(e)}")
            return False, f'Failed to remove favorite: {str(e)}'
    
    def get_user_favorites(self, user_id):
        try:
            if not ObjectId.is_valid(user_id):
                return False, 'Invalid user ID', []
            
            user = self.collection.find_one(
                {'_id': ObjectId(user_id)},
                {'favorites': 1}
            )
            
            if user:
                return True, 'Favorites retrieved', user.get('favorites', [])
            return False, 'User not found', []
            
        except Exception as e:
            print(f"Get favorites error: {str(e)}")
            return False, f'Failed to get favorites: {str(e)}', []
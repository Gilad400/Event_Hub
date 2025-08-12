import requests
from datetime import datetime
from app.config import Config

class EventService:
    
    def __init__(self):
        self.api_key = Config.TICKETMASTER_API_KEY
        self.base_url = f"{Config.TICKETMASTER_BASE_URL}/events.json"
        self.timeout = 10
    
    def search_events(self, **params):
        """
        FIXED: Enhanced event search with better parameter handling
        """
        try:
            # Build query parameters
            query_params = {'apikey': self.api_key}
            
            # Handle search parameters
            if params.get('keyword'):
                query_params['keyword'] = params['keyword']
            
            if params.get('city'):
                query_params['city'] = params['city']
            
            if params.get('stateCode'):
                query_params['stateCode'] = params['stateCode']
            
            # Handle date formatting
            if params.get('startDate'):
                start_date = datetime.fromisoformat(params['startDate'].replace('Z', '+00:00'))
                query_params['startDateTime'] = start_date.strftime('%Y-%m-%dT%H:%M:%SZ')
            
            if params.get('endDate'):
                end_date = datetime.fromisoformat(params['endDate'].replace('Z', '+00:00'))
                query_params['endDateTime'] = end_date.strftime('%Y-%m-%dT%H:%M:%SZ')
            
            if params.get('segment'):
                query_params['segmentName'] = params['segment']
            
            # Additional useful parameters
            if params.get('size'):
                query_params['size'] = min(int(params['size']), 200) 
            else:
                query_params['size'] = 20  
            
            if params.get('page'):
                query_params['page'] = params['page']
            
            # Sort by date
            query_params['sort'] = 'date,asc'
            
            # Make API request with timeout
            response = requests.get(
                self.base_url, 
                params=query_params,
                timeout=self.timeout
            )
            response.raise_for_status()
            
            data = response.json()
            
            # Process and format response
            return self._format_events_response(data)
            
        except requests.exceptions.Timeout:
            return {
                'success': False,
                'error': 'Request timeout - Ticketmaster API is not responding'
            }
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'API request failed: {str(e)}'
            }
        except Exception as e:
            print(f"Search error: {str(e)}")
            return {
                'success': False,
                'error': f'Search failed: {str(e)}'
            }
    
    def get_event_by_id(self, event_id):
        try:
            url = f"{Config.TICKETMASTER_BASE_URL}/events/{event_id}.json"
            response = requests.get(
                url,
                params={'apikey': self.api_key},
                timeout=self.timeout
            )
            response.raise_for_status()
            
            data = response.json()
            return {
                'success': True,
                'event': self._format_single_event(data)
            }
            
        except Exception as e:
            print(f"Get event error: {str(e)}")
            return {
                'success': False,
                'error': f'Failed to get event: {str(e)}'
            }
    
    def _format_events_response(self, data):
        try:
            events = []
            
            if '_embedded' in data and 'events' in data['_embedded']:
                for event in data['_embedded']['events']:
                    events.append(self._format_single_event(event))
            
            # Pagination info
            page_info = data.get('page', {})
            
            return {
                'success': True,
                'events': events,
                'pagination': {
                    'size': page_info.get('size', 20),
                    'totalElements': page_info.get('totalElements', 0),
                    'totalPages': page_info.get('totalPages', 0),
                    'number': page_info.get('number', 0)
                }
            }
            
        except Exception as e:
            print(f"Format error: {str(e)}")
            return {
                'success': False,
                'error': 'Failed to format response',
                'events': []
            }
    
    def _format_single_event(self, event):
        try:
            # Extract venue information
            venue = None
            if '_embedded' in event and 'venues' in event['_embedded']:
                venue_data = event['_embedded']['venues'][0]
                venue = {
                    'name': venue_data.get('name', 'Unknown Venue'),
                    'city': venue_data.get('city', {}).get('name', ''),
                    'state': venue_data.get('state', {}).get('name', ''),
                    'country': venue_data.get('country', {}).get('name', ''),
                    'address': venue_data.get('address', {}).get('line1', '')
                }
            
            # Extract price information
            price_ranges = []
            if 'priceRanges' in event:
                for price in event['priceRanges']:
                    price_ranges.append({
                        'type': price.get('type', 'standard'),
                        'min': price.get('min', 0),
                        'max': price.get('max', 0),
                        'currency': price.get('currency', 'USD')
                    })
            
            # Extract images
            images = event.get('images', [])
            image_url = None
            if images:
                # Sort by width
                sorted_images = sorted(images, key=lambda x: x.get('width', 0), reverse=True)
                image_url = sorted_images[0].get('url')
            
            # Format date and time
            date_info = event.get('dates', {}).get('start', {})
            event_date = date_info.get('dateTime', '')
            local_date = date_info.get('localDate', '')
            local_time = date_info.get('localTime', '')
            
            return {
                'id': event.get('id'),
                'name': event.get('name'),
                'description': event.get('info', event.get('pleaseNote', '')),
                'url': event.get('url'),
                'image': image_url,
                'images': images[:3],
                'date': event_date,
                'localDate': local_date,
                'localTime': local_time,
                'venue': venue,
                'priceRanges': price_ranges,
                'segment': event.get('classifications', [{}])[0].get('segment', {}).get('name'),
                'genre': event.get('classifications', [{}])[0].get('genre', {}).get('name'),
                'subGenre': event.get('classifications', [{}])[0].get('subGenre', {}).get('name'),
                'status': event.get('dates', {}).get('status', {}).get('code', 'onsale'),
                'seatmap': event.get('seatmap', {}).get('staticUrl')  
            }
            
        except Exception as e:
            print(f"Event format error: {str(e)}")  
            return {
                'id': event.get('id', 'unknown'),
                'name': event.get('name', 'Unknown Event'),
                'error': 'Partial data available'
            }

# Create singleton instance
event_service = EventService()
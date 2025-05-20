import os
import logging
import json
from flask import Flask, render_template, request, jsonify, send_from_directory, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix
import uuid
from flask_login import LoginManager, current_user, login_required

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Set up database
class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default_dev_key")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configure database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
db.init_app(app)

# Setup login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "replit_auth.login"  # type: ignore

@login_manager.user_loader
def load_user(user_id):
    from models import User
    return User.query.get(user_id)

# Make session permanent, but it still expires after some time (browser session)
@app.before_request
def make_session_permanent():
    session.permanent = True

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/compare')
def compare():
    return render_template('compare.html')

@app.route('/video-to-slides')
def video_to_slides():
    return render_template('video_to_slides.html')

@app.route('/dashboard')
@login_required
def dashboard():
    from models import SavedComparison, SlideDeck
    
    # Get user's saved comparisons
    saved_comparisons = SavedComparison.query.filter_by(user_id=current_user.id).order_by(
        SavedComparison.created_at.desc()).all()
    
    # Get user's slide decks
    slide_decks = SlideDeck.query.filter_by(user_id=current_user.id).order_by(
        SlideDeck.created_at.desc()).all()
    
    return render_template('dashboard.html', 
                           saved_comparisons=saved_comparisons,
                           slide_decks=slide_decks)

@app.route('/save-comparison', methods=['POST'])
@login_required
def save_comparison():
    from models import SavedComparison
    
    data = request.json
    if not data:
        return jsonify({'success': False, 'error': 'No data provided'}), 400
    
    # Create a new saved comparison
    comparison = SavedComparison()
    comparison.user_id = current_user.id
    comparison.title = data.get('title', 'Untitled Comparison')
    comparison.description = data.get('description', '')
    comparison.document_a_name = data.get('documentAName', '')
    comparison.document_b_name = data.get('documentBName', '')
    comparison.document_a_type = data.get('documentAType', 'image')
    comparison.document_b_type = data.get('documentBType', 'image')
    comparison.document_a_url = data.get('documentAUrl', '')
    comparison.document_b_url = data.get('documentBUrl', '')
    comparison.results_json = json.dumps(data.get('results', {}))
    
    db.session.add(comparison)
    db.session.commit()
    
    return jsonify({'success': True, 'id': comparison.id})

@app.route('/create-slide-deck', methods=['POST'])
def create_slide_deck():
    from models import SlideDeck
    
    # Log the incoming request
    logging.info("Processing video request")
    
    # Get request data
    data = request.json
    if not data:
        logging.error("No data provided in request")
        return jsonify({'success': False, 'error': 'No data provided'}), 400
    
    # Log the data received (omitting API key for security)
    logging.info(f"Received data: {str({k: v for k, v in data.items() if k != 'apiKey'})}")
    
    # Get API key (optional now)
    api_key = data.get('apiKey')
    
    # Get video URL
    video_url = data.get('videoUrl', '')
    if not video_url:
        logging.error("Video URL is missing")
        return jsonify({'success': False, 'error': 'Video URL is required'}), 400
    else:
        logging.info(f"Processing video URL: {video_url}")
        
    try:
        # Process video directly without database using transcript API
        import transcript_utils
        logging.info("Calling transcript_utils.process_video_transcript")
        
        try:
            # Process with YouTube transcript (API key not required)
            presentation_data = transcript_utils.process_video_transcript(video_url, api_key)
            
            # Return the result
            return jsonify({
                'success': True,
                'saved': False,
                'presentation': presentation_data
            })
            
        except Exception as processing_error:
            error_message = str(processing_error)
            logging.error(f"Error processing video: {error_message}")
            return jsonify({'success': False, 'error': f"Error processing video: {error_message}"}), 500
            
    except Exception as e:
        logging.error(f"Unexpected error in create_slide_deck: {str(e)}")
        return jsonify({'success': False, 'error': f"Unexpected error: {str(e)}"}), 500

@app.route('/api/user/theme', methods=['POST'])
@login_required
def update_theme():
    from models import User
    data = request.json
    if not data or 'theme' not in data:
        return jsonify({'success': False, 'error': 'No theme provided'}), 400
    
    theme = data['theme']
    if theme not in ['light', 'dark']:
        return jsonify({'success': False, 'error': 'Invalid theme'}), 400
    
    # Update user's theme preference
    if current_user.is_authenticated:
        user = User.query.get(current_user.id)
        if user:
            user.theme_preference = theme
            db.session.commit()
    
    return jsonify({'success': True})

@app.route('/api/comparison/delete/<int:comparison_id>', methods=['POST'])
@login_required
def delete_comparison(comparison_id):
    from models import SavedComparison
    
    comparison = SavedComparison.query.get(comparison_id)
    if not comparison:
        return jsonify({'success': False, 'error': 'Comparison not found'}), 404
    
    # Ensure the comparison belongs to the current user
    if comparison.user_id != current_user.id:
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    
    db.session.delete(comparison)
    db.session.commit()
    
    return jsonify({'success': True})

@app.route('/api/slide-deck/delete/<int:deck_id>', methods=['POST'])
@login_required
def delete_slide_deck(deck_id):
    from models import SlideDeck
    
    deck = SlideDeck.query.get(deck_id)
    if not deck:
        return jsonify({'success': False, 'error': 'Slide deck not found'}), 404
    
    # Ensure the deck belongs to the current user
    if deck.user_id != current_user.id:
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    
    db.session.delete(deck)
    db.session.commit()
    
    return jsonify({'success': True})

@app.route('/api/slide-deck/retry/<int:deck_id>', methods=['POST'])
@login_required
def retry_processing(deck_id):
    from models import SlideDeck
    
    deck = SlideDeck.query.get(deck_id)
    if not deck:
        return jsonify({'success': False, 'error': 'Slide deck not found'}), 404
    
    # Ensure the deck belongs to the current user
    if deck.user_id != current_user.id:
        return jsonify({'success': False, 'error': 'Unauthorized'}), 403
    
    deck.status = 'pending'
    db.session.commit()
    
    # Queue the processing task
    process_video_to_slides(deck_id)
    
    return jsonify({'success': True})

# Serve static files
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

# Video processing functions
def process_video_to_slides(deck_id, api_key=None):
    """Process a video to create slides and save to database (for logged-in users)"""
    from models import SlideDeck
    import youtube_processor
    
    # Get the slide deck
    deck = SlideDeck.query.get(deck_id)
    if not deck:
        logging.error(f"Slide deck not found: {deck_id}")
        return
    
    try:
        deck.status = 'processing'
        db.session.commit()
        
        # Process the video with our YouTube processor - no API key needed!
        presentation_data = youtube_processor.process_video(deck.video_url, api_key)
        
        # Update the slide deck
        deck.slides_json = json.dumps(presentation_data)
        deck.status = 'completed'
        db.session.commit()
        
        return True
    except Exception as e:
        logging.error(f"Error processing video: {str(e)}")
        deck.status = 'failed'
        db.session.commit()
        return False

def process_video_directly(video_url, api_key):
    """Process a video directly without saving to database (for non-logged-in users)"""
    import youtube_processor
    
    try:
        # Process the video with our YouTube processor - no API key needed!
        presentation_data = youtube_processor.process_video(video_url, api_key)
        return {
            'success': True,
            'presentation': presentation_data
        }
    except Exception as e:
        logging.error(f"Error processing video directly: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

# Import routes
from replit_auth import make_replit_blueprint
app.register_blueprint(make_replit_blueprint(), url_prefix="/auth")
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
login_manager.login_view = "replit_auth.login"

@login_manager.user_loader
def load_user(user_id):
    from models import User
    return User.query.get(user_id)

# Make session permanent
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
    saved_comparisons = SavedComparison.query.filter_by(user_id=current_user.id).order_by(SavedComparison.created_at.desc()).all()
    slide_decks = SlideDeck.query.filter_by(user_id=current_user.id).order_by(SlideDeck.created_at.desc()).all()
    return render_template('dashboard.html', comparisons=saved_comparisons, decks=slide_decks)

@app.route('/save-comparison', methods=['POST'])
@login_required
def save_comparison():
    from models import SavedComparison
    data = request.json
    if not data:
        return jsonify({'success': False, 'error': 'No data provided'}), 400
    
    # Create a new comparison
    comparison = SavedComparison()
    comparison.user_id = current_user.id
    comparison.title = data.get('title', 'Untitled Comparison')
    comparison.description = data.get('description', '')
    comparison.document_a_name = data.get('documentAName', '')
    comparison.document_b_name = data.get('documentBName', '')
    comparison.document_a_type = data.get('documentAType', '')
    comparison.document_b_type = data.get('documentBType', '')
    comparison.document_a_url = data.get('documentAUrl', '')
    comparison.document_b_url = data.get('documentBUrl', '')
    comparison.results_json = data.get('resultsJson', '{}')
    
    db.session.add(comparison)
    db.session.commit()
    
    return jsonify({'success': True, 'id': comparison.id})

@app.route('/create-slide-deck', methods=['POST'])
@login_required
def create_slide_deck():
    from models import SlideDeck
    data = request.json
    if not data:
        return jsonify({'success': False, 'error': 'No data provided'}), 400
    
    # Create a new slide deck
    slide_deck = SlideDeck()
    slide_deck.user_id = current_user.id
    slide_deck.title = data.get('title', 'Untitled Deck')
    slide_deck.description = data.get('description', '')
    slide_deck.video_url = data.get('videoUrl', '')
    slide_deck.video_title = data.get('videoTitle', '')
    slide_deck.status = 'pending'
    
    db.session.add(slide_deck)
    db.session.commit()
    
    # Queue the processing task (would be async in production)
    process_video_to_slides(slide_deck.id)
    
    return jsonify({'success': True, 'id': slide_deck.id})

@app.route('/api/user/theme', methods=['POST'])
@login_required
def update_theme():
    theme = request.json.get('theme') if request.json else None
    if theme in ['light', 'dark']:
        current_user.theme_preference = theme
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Invalid theme'})
    
@app.route('/delete-comparison/<int:comparison_id>', methods=['POST'])
@login_required
def delete_comparison(comparison_id):
    from models import SavedComparison
    comparison = SavedComparison.query.filter_by(id=comparison_id, user_id=current_user.id).first()
    
    if not comparison:
        return jsonify({'success': False, 'error': 'Comparison not found or access denied'})
    
    try:
        db.session.delete(comparison)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error deleting comparison: {str(e)}")
        return jsonify({'success': False, 'error': 'Error deleting comparison'})
        
@app.route('/delete-slide-deck/<int:deck_id>', methods=['POST'])
@login_required
def delete_slide_deck(deck_id):
    from models import SlideDeck
    deck = SlideDeck.query.filter_by(id=deck_id, user_id=current_user.id).first()
    
    if not deck:
        return jsonify({'success': False, 'error': 'Slide deck not found or access denied'})
    
    try:
        db.session.delete(deck)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error deleting slide deck: {str(e)}")
        return jsonify({'success': False, 'error': 'Error deleting slide deck'})
        
@app.route('/retry-processing/<int:deck_id>', methods=['POST'])
@login_required
def retry_processing(deck_id):
    from models import SlideDeck
    deck = SlideDeck.query.filter_by(id=deck_id, user_id=current_user.id).first()
    
    if not deck:
        return jsonify({'success': False, 'error': 'Slide deck not found or access denied'})
    
    if deck.status != 'failed':
        return jsonify({'success': False, 'error': 'Only failed processing can be retried'})
    
    try:
        deck.status = 'pending'
        db.session.commit()
        
        # Queue the processing task
        process_video_to_slides(deck.id)
        
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error retrying processing: {str(e)}")
        return jsonify({'success': False, 'error': 'Error retrying processing'})

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

# Process video to slides (this would be async in production)
def process_video_to_slides(deck_id):
    # This would be handled by a background worker in production
    from models import SlideDeck
    import json
    import time
    from openai_utils import process_video
    
    deck = SlideDeck.query.get(deck_id)
    if not deck:
        return
    
    try:
        deck.status = 'processing'
        db.session.commit()
        
        # Process the video (actual implementation in openai_utils.py)
        slides_data = process_video(deck.video_url)
        
        # Update the deck with the results
        deck.slides_json = json.dumps(slides_data)
        deck.status = 'completed'
        db.session.commit()
    except Exception as e:
        logging.error(f"Error processing video: {str(e)}")
        deck.status = 'failed'
        db.session.commit()

# Initialize database
with app.app_context():
    # Import models
    import models
    from replit_auth import make_replit_blueprint
    
    # Create all tables
    db.create_all()
    
    # Register authentication blueprint
    app.register_blueprint(make_replit_blueprint(), url_prefix="/auth")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

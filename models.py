from datetime import datetime
import json
from flask_login import UserMixin
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Text, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
import app as app_module

db = app_module.db

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=True)
    first_name = db.Column(db.String, nullable=True)
    last_name = db.Column(db.String, nullable=True)
    profile_image_url = db.Column(db.String, nullable=True)
    theme_preference = db.Column(db.String, default='light', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Relationships
    saved_comparisons = db.relationship('SavedComparison', backref='user', lazy=True, cascade="all, delete-orphan")
    slide_decks = db.relationship('SlideDeck', backref='user', lazy=True, cascade="all, delete-orphan")

class SavedComparison(db.Model):
    __tablename__ = 'saved_comparisons'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    document_a_name = db.Column(db.String, nullable=False)
    document_b_name = db.Column(db.String, nullable=False)
    document_a_type = db.Column(db.String, nullable=False)  # 'image' or 'pdf'
    document_b_type = db.Column(db.String, nullable=False)  # 'image' or 'pdf'
    document_a_url = db.Column(db.String, nullable=True)  # URL or path to stored file
    document_b_url = db.Column(db.String, nullable=True)  # URL or path to stored file
    results_json = db.Column(db.Text, nullable=False)  # Stored as JSON string
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

class SlideDeck(db.Model):
    __tablename__ = 'slide_decks'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    video_url = db.Column(db.String, nullable=False)
    video_title = db.Column(db.String, nullable=True)
    slides_json = db.Column(db.Text, nullable=True)  # Stored as JSON string
    slides_url = db.Column(db.String, nullable=True)  # URL to downloadable slides
    status = db.Column(db.String, default='pending', nullable=False)  # pending, processing, completed, failed
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

class OAuth(db.Model):
    """OAuth token storage for Flask-Dance."""
    __tablename__ = 'oauth'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey(User.id))
    provider = db.Column(db.String(50), nullable=False)
    token = db.Column(db.JSON, nullable=False)
    browser_session_key = db.Column(db.String, nullable=False)
    
    # Define relationship with User model
    user = db.relationship(User)
    
    # Add unique constraint for user_id, provider, browser_session_key
    __table_args__ = (db.UniqueConstraint('user_id', 'provider', 'browser_session_key'),)
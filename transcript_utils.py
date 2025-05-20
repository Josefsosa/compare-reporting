import os
import json
import requests
import re
import logging
from pytube import YouTube

# Add custom error handling for the transcript API
YouTubeTranscriptApi = None
try:
    from youtube_transcript_api import YouTubeTranscriptApi as TranscriptApi
    YouTubeTranscriptApi = TranscriptApi
except ImportError:
    logging.error("Could not import YouTubeTranscriptApi. Using simplified transcript extraction.")

def extract_video_id(youtube_url):
    """Extract the YouTube video ID from a URL."""
    # Regular expression to match YouTube video IDs
    youtube_regex = r'(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})'
    match = re.search(youtube_regex, youtube_url)
    return match.group(1) if match else None

def get_video_info(youtube_url):
    """Get basic information about a YouTube video."""
    try:
        yt = YouTube(youtube_url)
        return {
            "title": yt.title,
            "author": yt.author,
            "description": yt.description,
            "length_seconds": yt.length,
            "views": yt.views,
            "thumbnail_url": yt.thumbnail_url
        }
    except Exception as e:
        logging.error(f"Error getting video info: {str(e)}")
        return {
            "title": "Video information unavailable",
            "thumbnail_url": None
        }

def get_video_transcript(video_id):
    """Get the transcript of a YouTube video."""
    if not YouTubeTranscriptApi:
        logging.error("YouTubeTranscriptApi not available")
        return "Transcript not available. Using placeholder data for demonstration."
    
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        full_transcript = ' '.join([entry['text'] for entry in transcript_list])
        return full_transcript
    except Exception as e:
        logging.error(f"Error getting transcript: {str(e)}")
        return "No transcript available for this video. Using placeholder data for demonstration."

def generate_slides_from_transcript(video_url, api_key=None):
    """
    Generate slides from a YouTube video transcript.
    
    Args:
        video_url (str): URL of the YouTube video
        api_key (str, optional): OpenAI API key (not used in this implementation)
    
    Returns:
        dict: Presentation data with slides
    """
    # Get video ID and info
    video_id = extract_video_id(video_url)
    video_info = get_video_info(video_url)
    
    if not video_id:
        logging.error("Invalid YouTube URL")
        return {
            "title": "Error Processing Video",
            "slides": [
                {
                    "title": "Invalid YouTube URL",
                    "content": ["The provided URL is not a valid YouTube video URL."],
                    "image_description": "Error icon"
                }
            ]
        }
    
    # Get transcript
    transcript = get_video_transcript(video_id)
    if not transcript:
        logging.warning("No transcript available, using video info to create basic slides")
        # Create basic slides from video info
        return {
            "title": video_info.get("title", "Video Presentation"),
            "slides": [
                {
                    "title": video_info.get("title", "Video Title"),
                    "content": [
                        f"By: {video_info.get('author', 'Unknown')}",
                        "Generated automatically from video metadata"
                    ],
                    "image_description": "Title slide with video thumbnail",
                    "image_url": video_info.get("thumbnail_url", f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg")
                },
                {
                    "title": "About This Video",
                    "content": [
                        "No transcript was available for this video.",
                        f"Duration: {video_info.get('length_seconds', 0)} seconds",
                        f"Views: {video_info.get('views', 'Unknown')}"
                    ],
                    "image_description": "Information slide",
                    "image_url": "https://placehold.co/600x400?text=Video+Info"
                }
            ]
        }
    
    # Process transcript locally to generate a basic presentation
    slides = []
    
    # Add title slide
    slides.append({
        "title": video_info.get("title", "Presentation"),
        "content": [
            f"by {video_info.get('author', 'Unknown author')}",
            "Generated from YouTube transcript"
        ],
        "image_description": "Title slide with video thumbnail",
        "image_url": video_info.get("thumbnail_url", f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg")
    })
    
    # Simple transcript processing - split by paragraphs or length
    paragraphs = []
    current_paragraph = ""
    
    # Break transcript into logical paragraphs
    for sentence in transcript.split('. '):
        current_paragraph += sentence + '. '
        if len(current_paragraph) > 500:  # Create a new paragraph after ~500 chars
            paragraphs.append(current_paragraph.strip())
            current_paragraph = ""
    
    if current_paragraph:  # Add the last paragraph if not empty
        paragraphs.append(current_paragraph.strip())
    
    # Create content slides - one per paragraph
    for i, paragraph in enumerate(paragraphs[:8]):  # Limit to 8 content slides
        # Create bullet points from paragraph
        bullet_points = []
        sentences = paragraph.split('. ')
        
        for j in range(0, len(sentences), 2):
            combined = '. '.join([s for s in sentences[j:j+2] if s])
            if combined:
                bullet_points.append(combined)
        
        # Add slide
        if bullet_points:
            slides.append({
                "title": f"Point {i+1}",
                "content": bullet_points[:5],  # Limit to 5 bullet points per slide
                "image_description": f"Visual representing content from slide {i+1}",
                "image_url": "https://placehold.co/600x400?text=Slide+Image"
            })
    
    # Add conclusion slide
    slides.append({
        "title": "Conclusion",
        "content": [
            "Thank you for watching!",
            f"Video: {video_info.get('title', '')}",
            f"Creator: {video_info.get('author', 'Unknown')}"
        ],
        "image_description": "Conclusion slide with thank you message",
        "image_url": "https://placehold.co/600x400?text=Thank+You"
    })
    
    # Create final presentation
    presentation = {
        "title": video_info.get("title", "Presentation from YouTube"),
        "slides": slides,
        "video_metadata": {
            "title": video_info.get("title", ""),
            "author": video_info.get("author", ""),
            "url": video_url,
            "thumbnail_url": video_info.get("thumbnail_url", f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg")
        }
    }
    
    return presentation

def process_video_transcript(video_url, api_key=None):
    """
    Main function to process a video transcript and generate a presentation.
    
    Args:
        video_url (str): URL of the YouTube video
        api_key (str, optional): OpenAI API key (not used in this version)
    
    Returns:
        dict: Presentation data with slides
    """
    logging.info(f"Processing video transcript: {video_url}")
    presentation_data = generate_slides_from_transcript(video_url, api_key)
    return presentation_data
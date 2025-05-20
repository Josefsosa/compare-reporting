import logging
import re
import json
from pytube import YouTube

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

def generate_presentation_from_video(video_url):
    """
    Generate a presentation from a YouTube video without requiring OpenAI API.
    
    Uses video metadata and description to create basic slides.
    """
    # Extract video ID and get video info
    video_id = extract_video_id(video_url)
    if not video_id:
        return {
            "title": "Error: Invalid YouTube URL",
            "slides": [
                {
                    "title": "Error",
                    "content": ["The provided URL is not a valid YouTube video URL."],
                    "image_url": "https://placehold.co/600x400?text=Error"
                }
            ]
        }
    
    # Get video info
    video_info = get_video_info(video_url)
    
    # Create slides array
    slides = []
    
    # Title slide
    slides.append({
        "title": video_info.get("title", "Presentation"),
        "content": [
            f"by {video_info.get('author', 'Unknown author')}",
            "Generated automatically from YouTube"
        ],
        "image_url": video_info.get("thumbnail_url", f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg")
    })
    
    # Process description to create content slides
    description = video_info.get("description", "")
    
    # Split description into paragraphs
    paragraphs = [p for p in description.split("\n\n") if p.strip()]
    
    # Create content slides from paragraphs
    for i, paragraph in enumerate(paragraphs[:5]):  # Limit to 5 content slides
        if len(paragraph) > 30:  # Only use paragraphs with substantial content
            # Create bullet points by splitting sentences
            sentences = [s.strip() for s in paragraph.split(".") if s.strip()]
            bullet_points = sentences[:5]  # Limit to 5 bullet points per slide
            
            if bullet_points:
                # Create a more dynamic image for each point based on the slide number
                image_themes = [
                    "technology", "business", "education", 
                    "innovation", "growth", "success"
                ]
                theme = image_themes[i % len(image_themes)]
                
                slides.append({
                    "title": f"Point {i+1}",
                    "content": bullet_points,
                    "image_url": f"https://source.unsplash.com/400x300/?{theme},{i+1}"
                })
    
    # Add stats slide with better visualization
    views = video_info.get('views', 0)
    if isinstance(views, str):
        views = '1000'  # Default if we can't parse
    
    slides.append({
        "title": "Video Statistics",
        "content": [
            f"Length: {video_info.get('length_seconds', 0)} seconds",
            f"Views: {video_info.get('views', 'Unknown')}",
            f"Channel: {video_info.get('author', 'Unknown')}"
        ],
        "image_url": f"https://source.unsplash.com/400x300/?statistics,analytics,data"
    })
    
    # Add conclusion slide with better image
    slides.append({
        "title": "Conclusion",
        "content": [
            "Thank you for watching!",
            f"Video: {video_info.get('title', '')}",
            f"Creator: {video_info.get('author', 'Unknown')}"
        ],
        "image_url": f"https://source.unsplash.com/400x300/?conclusion,presentation,thank+you"
    })
    
    # Create presentation object
    presentation = {
        "title": video_info.get("title", "YouTube Presentation"),
        "slides": slides,
        "video_metadata": {
            "title": video_info.get("title", ""),
            "author": video_info.get("author", ""),
            "url": video_url,
            "thumbnail_url": video_info.get("thumbnail_url", f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg")
        }
    }
    
    return presentation

def process_video(video_url, api_key=None):
    """
    Process a YouTube video and generate a presentation.
    Works without requiring an API key.
    
    Args:
        video_url (str): URL of the YouTube video
        api_key (str, optional): Not used in this implementation
        
    Returns:
        dict: Presentation data with slides
    """
    try:
        # Generate presentation from video metadata
        return generate_presentation_from_video(video_url)
    except Exception as e:
        logging.error(f"Error processing video: {str(e)}")
        return {
            "title": "Error Processing Video",
            "slides": [
                {
                    "title": "Error",
                    "content": [
                        "An error occurred while processing the video.",
                        f"Error details: {str(e)}"
                    ],
                    "image_url": "https://placehold.co/600x400?text=Error"
                }
            ]
        }
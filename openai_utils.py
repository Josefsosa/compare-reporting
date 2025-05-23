import os
import json
import requests
import re
import logging
from pytube import YouTube
from openai import OpenAI

# Default OpenAI client using environment variable (fallback)
default_api_key = os.environ.get("OPENAI_API_KEY")
default_client = OpenAI(api_key=default_api_key) if default_api_key else None

# Function to get OpenAI client with user's API key
def get_client(api_key=None):
    """Get an OpenAI client instance with the provided API key or default"""
    if api_key:
        return OpenAI(api_key=api_key)
    elif default_client:
        return default_client
    else:
        raise ValueError("No API key provided and no default API key configured")

def extract_video_id(youtube_url):
    """Extract the YouTube video ID from a URL."""
    # Regular expression to match YouTube video IDs
    youtube_regex = r'(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})'
    match = re.search(youtube_regex, youtube_url)
    return match.group(1) if match else None

def download_video_thumbnail(video_id):
    """Download and return the URL to a YouTube video thumbnail."""
    thumbnail_url = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
    return thumbnail_url

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

def analyze_video_content(video_url, api_key=None):
    """
    Analyze a YouTube video and extract key points for slides.
    This is a simplified version that would actually use frames and audio in production.
    
    Args:
        video_url (str): URL of the YouTube video to analyze
        api_key (str, optional): OpenAI API key. If not provided, uses default key.
    """
    # Get video basic info
    video_info = get_video_info(video_url)
    video_id = extract_video_id(video_url)
    
    # Default presentation data in case of errors
    default_presentation = {
        "title": video_info.get("title", "Presentation"),
        "slides": [
            {
                "title": "Error Processing Video",
                "content": ["We encountered an error while processing this video.", 
                            "Please try again later or with a different video."],
                "image_description": "An error icon or warning symbol"
            }
        ],
        "video_metadata": {
            "title": video_info.get("title", ""),
            "url": video_url,
            "thumbnail_url": video_info.get("thumbnail_url", "")
        }
    }
    
    # Get OpenAI client with user's API key or default
    try:
        client = get_client(api_key)
    except ValueError as e:
        logging.error(f"API key error: {str(e)}")
        return default_presentation
    
    # In a full implementation, we would:
    # 1. Extract frames from the video at regular intervals
    # 2. Extract audio and transcribe it
    # 3. Analyze the content using the GPT-4 Vision API
    
    # For this demo, we'll use the video title and description to generate slides
    prompt = f"""
    Create a presentation based on the following YouTube video:
    
    Title: {video_info['title']}
    Description: {video_info['description']}
    
    Format the presentation as a JSON object with the following structure:
    {{
        "title": "Presentation title",
        "slides": [
            {{
                "title": "Slide title",
                "content": ["Bullet point 1", "Bullet point 2"],
                "image_description": "Description of an appropriate image for this slide"
            }}
        ]
    }}
    
    The presentation should have:
    1. A title slide
    2. An agenda/overview slide
    3. 5-7 content slides covering the main points
    4. A conclusion slide
    
    Each slide should be concise with 2-5 bullet points. The image_description should be detailed enough that an AI image generator could create a relevant image.
    """
    
    try:
        # Call OpenAI API to generate presentation content
        response = client.chat.completions.create(
            model="gpt-4o",  # the newest OpenAI model is "gpt-4o" which was released May 13, 2024
            messages=[
                {"role": "system", "content": "You are an expert at creating professional presentations based on video content."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        # Parse the response
        content = response.choices[0].message.content
        
        if not content:
            logging.error("No content returned from OpenAI API")
            return default_presentation
            
        try:
            presentation_data = json.loads(content)
            
            # Add video metadata
            presentation_data["video_metadata"] = {
                "title": video_info.get("title", ""),
                "author": video_info.get("author", ""),
                "url": video_url,
                "thumbnail_url": video_info.get("thumbnail_url", f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg")
            }
            
            return presentation_data
            
        except json.JSONDecodeError as json_err:
            logging.error(f"JSON parse error: {str(json_err)}")
            return default_presentation
        
    except Exception as e:
        logging.error(f"Error analyzing video content: {str(e)}")
        return default_presentation

def generate_slide_images(slides):
    """
    Generate images for each slide based on the image_description.
    In a production system, this would call DALL-E or another image generation API.
    For this demo, we'll return placeholder image URLs.
    """
    for slide in slides:
        # In a real implementation, this would call DALL-E API
        # For now, just use a placeholder
        slide["image_url"] = "https://placehold.co/600x400?text=Slide+Image"
    
    return slides

def process_video(video_url, api_key=None):
    """
    Main function to process a video and generate a presentation.
    
    Args:
        video_url (str): URL of the YouTube video to analyze
        api_key (str, optional): OpenAI API key. If not provided, uses default key.
    """
    logging.info(f"Processing video: {video_url}")
    
    # Analyze video content with the provided API key
    presentation_data = analyze_video_content(video_url, api_key)
    
    # Generate images for slides
    if "slides" in presentation_data:
        presentation_data["slides"] = generate_slide_images(presentation_data["slides"])
    
    return presentation_data
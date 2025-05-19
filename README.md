# Tech Analysis Tool

A powerful web application for technology comparison and analysis with presentation generation capabilities.

![Tech Analysis Tool](static/images/app-screenshot.png)

## Features

- **Technology Comparison Tool**: Compare technologies side-by-side using images or PDFs
- **Video-to-Slides Generator**: Convert YouTube videos into professional presentation slides using AI
- **User Accounts**: Save your comparisons and slide decks for future reference
- **Dark/Light Theme**: Choose your preferred visual theme
- **Multiple AI Providers**: Configure different AI providers for the video-to-slides feature

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5, Chart.js
- **Backend**: Python, Flask
- **Database**: PostgreSQL
- **Authentication**: Replit Auth (OpenID Connect)
- **AI Integration**: OpenAI, Anthropic, Google Gemini (configurable)

## Running Locally

### Prerequisites

- Python 3.11 or higher
- PostgreSQL database
- API keys for AI providers (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tech-analysis-tool.git
   cd tech-analysis-tool
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the project root with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/tech_analysis
   SESSION_SECRET=your_secure_session_secret
   OPENAI_API_KEY=your_openai_api_key  # Optional
   ```

5. Initialize the database:
   ```bash
   flask db upgrade
   ```

6. Run the application:
   ```bash
   python main.py
   ```

7. Open your browser and navigate to `http://localhost:5000`

### Docker Deployment (Optional)

```bash
docker-compose up -d
```

This will start both the web application and a PostgreSQL database in containers.

## User Guide

### Technology Comparison Tool

1. Navigate to the "Comparison Tool" section from the left navigation menu
2. Upload two images or PDFs that you want to compare
3. Alternatively, provide URLs to online images or PDFs
4. Click "Compare" to analyze the documents
5. View the detailed comparison results
6. Save your comparison (requires login)

### Video to Slides Generator

1. Navigate to the "Video to Slides" section from the left navigation menu
2. Enter a YouTube video URL
3. (Optional) Configure your AI provider settings
4. Click "Generate Slides" to process the video
5. Review the generated presentation slides
6. Download as PowerPoint or save to your account (requires login)

### AI Provider Configuration

By default, the application uses OpenAI's GPT-4o model for video analysis. You can configure different AI providers:

1. In the "Video to Slides" section, click the "Configure" button under AI Provider Settings
2. Select your preferred provider (OpenAI, Anthropic, Google, or Custom)
3. Enter your API key
4. Select a specific model
5. For custom providers, enter the API endpoint URL
6. Click "Save Configuration"

Your settings are saved in your browser's local storage for convenience.

## Development

### Project Structure

```
tech-analysis-tool/
├── app.py            # Application initialization
├── main.py           # Entry point
├── models.py         # Database models
├── replit_auth.py    # Authentication setup
├── openai_utils.py   # AI integration utilities
├── static/           # Static assets
│   ├── css/          # Stylesheets
│   ├── js/           # JavaScript files
│   ├── icons/        # SVG icons
│   └── images/       # Images
├── templates/        # HTML templates
│   ├── layout.html   # Base template
│   ├── index.html    # Home page
│   ├── compare.html  # Comparison tool
│   ├── video_to_slides.html  # Video-to-slides tool
│   └── dashboard.html # User dashboard
└── requirements.txt  # Python dependencies
```

### Adding New Features

1. Create new templates in the `templates/` directory
2. Add static assets to the appropriate directories
3. Define models in `models.py`
4. Add routes in `app.py`
5. Implement JavaScript functionality in `static/js/`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Flask](https://flask.palletsprojects.com/) - Web framework
- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF rendering
- [OpenAI](https://openai.com/) - AI capabilities
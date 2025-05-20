# Installation Guide for Tech Analysis Tool

This guide provides detailed instructions for setting up and running the Tech Analysis Tool on your local machine. Follow these steps carefully to ensure a proper installation.

## System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux
- **Python**: 3.11 or higher
- **PostgreSQL**: 12.0 or higher
- **Disk Space**: At least 500 MB free space
- **Memory**: Minimum 2 GB RAM (4 GB recommended)

## Dependencies Installation

### 1. Python and Package Dependencies

First, make sure you have Python 3.11+ installed. You can verify your Python version with:

```bash
python --version
```

#### Setting up a Virtual Environment (Recommended)

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

#### Installing Required Packages

With your virtual environment activated, install the required packages:

```bash
pip install -r requirements.txt
```

If the requirements.txt file is not available, here are the core dependencies:

```bash
pip install flask flask-login flask-sqlalchemy flask-dance gunicorn oauthlib openai psycopg2-binary pyjwt pytube requests werkzeug
```

### 2. PostgreSQL Database Setup

#### Install PostgreSQL

- **Windows**: Download the installer from [PostgreSQL website](https://www.postgresql.org/download/windows/)
- **macOS**: Use Homebrew: `brew install postgresql`
- **Linux (Ubuntu/Debian)**: `sudo apt install postgresql postgresql-contrib`

#### Create a Database

```bash
# Log in to PostgreSQL
sudo -u postgres psql

# Create a database
CREATE DATABASE tech_analysis;

# Create a user (replace 'username' and 'password' with your preferred credentials)
CREATE USER username WITH PASSWORD 'password';

# Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE tech_analysis TO username;

# Exit PostgreSQL
\q
```

## Environment Configuration

Create a `.env` file in the root directory of the project with the following variables:

```
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/tech_analysis
PGUSER=username
PGPASSWORD=password
PGDATABASE=tech_analysis
PGHOST=localhost
PGPORT=5432

# Application Configuration
SESSION_SECRET=your_secure_session_secret
FLASK_ENV=development
FLASK_DEBUG=1

# AI Provider API Keys (Optional)
OPENAI_API_KEY=your_openai_api_key
```

## Running the Application

### First-time Setup

Initialize the database:

```bash
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

### Start the Application

```bash
# Development mode:
python main.py

# Production mode with Gunicorn:
gunicorn --bind 0.0.0.0:5000 --workers 4 main:app
```

The application will be available at `http://localhost:5000`.

## Troubleshooting

### Common Issues and Solutions

#### Database Connection Issues

If you encounter database connection problems, check:
- PostgreSQL service is running
- Database credentials are correct in your `.env` file
- Network connectivity if using a remote database

```bash
# Check if PostgreSQL is running
# On Windows:
sc query postgresql
# On macOS/Linux:
systemctl status postgresql
```

#### Package Installation Errors

If you encounter issues installing packages:

```bash
# Update pip
pip install --upgrade pip

# Install wheel (helps with some package installations)
pip install wheel

# Try installing packages individually if a specific package fails
```

#### Port Already in Use

If port 5000 is already in use:

```bash
# Change the port in main.py or use the PORT environment variable
# In .env file:
PORT=5001
```

## Using AI Provider Features

To use the Video-to-Slides feature with AI providers, you'll need API keys:

### OpenAI

1. Create an account at [OpenAI](https://openai.com/)
2. Generate an API key in your dashboard
3. Add to your `.env` file or enter it in the UI configuration panel

### Anthropic (Optional)

1. Create an account at [Anthropic](https://www.anthropic.com/)
2. Generate an API key
3. Enter it in the UI configuration panel

### Google Gemini (Optional)

1. Create a Google Cloud account
2. Enable the Gemini API
3. Create an API key
4. Enter it in the UI configuration panel

## Security Notes

- Never commit your `.env` file to version control
- Rotate API keys regularly
- Use strong, unique passwords for your database
- In production, enable HTTPS to protect user data

## Next Steps

After installation, you might want to:

1. Create an account by logging in
2. Try the Comparison Tool with sample images or PDFs
3. Test the Video-to-Slides feature with a YouTube URL
4. Explore the dark/light theme toggle
5. Save some comparisons to your account

## Need Help?

If you encounter issues not covered in this guide, please:
1. Check the [issues page](https://github.com/yourusername/tech-analysis-tool/issues) for similar problems
2. Create a new issue with detailed information about your problem
3. Include your OS, Python version, and relevant error messages
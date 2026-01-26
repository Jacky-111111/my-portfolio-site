# Jack Yu Devs - Personal Portfolio Website

A professional portfolio website built with FastAPI to showcase projects, skills, and contact information.

## Features

- **Projects Showcase**: Card-based grid layout displaying your projects
- **About Me**: Personal bio, skills, and interests section
- **Contact**: Easy ways for visitors to reach you
- **Modern Design**: Clean, responsive design with smooth animations
- **FastAPI Backend**: Fast and efficient Python web framework

## Project Structure

```
my-portfolio-site/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── templates/              # Jinja2 HTML templates
│   ├── base.html          # Base template with header/footer
│   ├── index.html         # Projects page (home)
│   ├── about.html         # About Me page
│   └── contact.html       # Contact page
├── static/                # Static files
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   └── js/
│       └── main.js        # JavaScript for interactivity
└── README.md
```

## Setup Instructions

1. **Create a virtual environment (recommended):**
   ```bash
   python3 -m venv venv
   ```

2. **Activate the virtual environment:**
   ```bash
   source venv/bin/activate  # On macOS/Linux
   # or
   venv\Scripts\activate     # On Windows
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   If you encounter SSL certificate issues, use:
   ```bash
   pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements.txt
   ```

4. **Run the development server:**
   
   **Option 1: Using the run script (easiest)**
   ```bash
   ./run.sh
   ```
   
   **Option 2: Manual activation and run**
   ```bash
   source venv/bin/activate
   python main.py
   ```
   
   **Option 3: Using uvicorn directly**
   ```bash
   source venv/bin/activate
   uvicorn main:app --reload
   ```

5. **Access the website:**
   Open your browser and navigate to `http://localhost:8000`

## Customization

### Adding Your Information

1. **About Page**: Edit `templates/about.html` to add your bio, skills, and interests
2. **Contact Page**: Update `templates/contact.html` with your email, GitHub, LinkedIn links
3. **Projects**: Modify `templates/index.html` to add your actual project information
4. **Social Links**: Update social media links in `templates/base.html` (header and footer)

### Adding Projects

Edit the project cards in `templates/index.html`. Each card has:
- A colored background (mint, peach, blue, or green)
- Project title and description
- Placeholder for project images or content

### Styling

Customize colors, fonts, and layout in `static/css/style.css`. The design uses CSS variables for easy theming.

## Deployment

For production deployment to `jackyudev.com`:

1. **Using a VPS/Cloud Provider:**
   - Set up a server (AWS, DigitalOcean, etc.)
   - Install Python and dependencies
   - Use a process manager like systemd or supervisor
   - Set up Nginx as a reverse proxy
   - Configure SSL with Let's Encrypt

2. **Using Platform-as-a-Service:**
   - Deploy to services like Railway, Render, or Fly.io
   - They handle most of the infrastructure setup

## Development

The site uses:
- **FastAPI**: Modern Python web framework
- **Jinja2**: Template engine for HTML
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern styling with flexbox and grid

## License

This project is for personal use. Make sure to credit any templates or resources you use.

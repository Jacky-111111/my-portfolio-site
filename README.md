# Jack Yu Dev - Personal Portfolio Website

A portfolio website built with FastAPI to showcase projects, skills, and contact information.

## Features

- **Interactive Projects Gallery**: Horizontal scrolling gallery with navigation controls and indicators
- **About Me Page**: Personal bio, education, skills, and interests with downloadable CV
- **Contact Page**: Multiple ways for visitors to get in touch
- **Fixed Header & Footer**: Consistent navigation and footer across all pages
- **Responsive Design**: Mobile-friendly layout that adapts to different screen sizes
- **Smooth Animations**: Hover effects and transitions for enhanced user experience
- **FastAPI Backend**: Fast and efficient Python web framework

## Project Structure

```
my-portfolio-site/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── run.sh                  # Development server startup script
├── templates/              # Jinja2 HTML templates
│   ├── base.html          # Base template with header/footer
│   ├── index.html         # Projects gallery page (home)
│   ├── about.html         # About Me page
│   └── contact.html       # Contact page
├── static/                # Static files
│   ├── css/
│   │   └── style.css      # Main stylesheet with responsive design
│   ├── js/
│   │   └── main.js        # JavaScript for gallery navigation
│   ├── images/            # Image assets
│   │   ├── favicon.svg
│   │   └── notion_avatar.png
│   └── files/             # Document files
│       └── [resume].pdf
└── README.md
```

## Live Website

Visit the live website at: **[jackyudev.com](https://jackyudev.com)**

## Customization

### Adding Projects

Edit the project cards in `templates/index.html`. Each card supports:
- Multiple color themes (mint, peach, blue, green)
- Project title, description, tech stack, and date
- Custom color square decorations

### Styling

Customize colors, fonts, and layout in `static/css/style.css`. The design uses CSS variables for easy theming:
- Color scheme defined in `:root` variables
- Responsive breakpoints for mobile devices
- Fixed header and footer with scrollable content area
- **Design Inspiration**: Color palette and visual style inspired by [zoom.com](https://zoom.com)

## Tech Stack

- **FastAPI**: Modern Python web framework for the backend
- **Jinja2**: Template engine for server-side HTML rendering
- **Vanilla JavaScript**: Lightweight client-side interactivity
- **CSS3**: Modern styling with flexbox, grid, and CSS variables
- **Uvicorn**: ASGI server for running the FastAPI application

## License

This project is for personal use.

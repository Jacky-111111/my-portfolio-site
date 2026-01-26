from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from jinja2 import Environment, FileSystemLoader
import os

app = FastAPI(title="Jack Yu Devs Portfolio", description="Personal portfolio website")

# Mount static files (CSS, JS, images)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Setup templates
env = Environment(loader=FileSystemLoader("templates"))


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Home page - displays projects"""
    template = env.get_template("index.html")
    return HTMLResponse(content=template.render(request=request))


@app.get("/about", response_class=HTMLResponse)
async def about(request: Request):
    """About Me page"""
    template = env.get_template("about.html")
    return HTMLResponse(content=template.render(request=request))


@app.get("/contact", response_class=HTMLResponse)
async def contact(request: Request):
    """Contact page"""
    template = env.get_template("contact.html")
    return HTMLResponse(content=template.render(request=request))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

import uvicorn
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from dotenv import load_dotenv
import os

load_dotenv()

from app.api.endpoints import router as api_router
from app.config.settings import settings

app = FastAPI(title="Intelligent Log Analyzer", version="1.0.0")

# Mount templates
templates = Jinja2Templates(directory="app/templates")

# Include API routes
app.include_router(api_router)

@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)

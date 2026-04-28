from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, contents

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://s51-funny-contents-project-3.onrender.com",
        "https://s51-funny-contents-project.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(contents.router)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from .routes import auth, loans, recovery
from .models.models import Base, engine

# Load env
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinRelief AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(loans.router, prefix="/api/loans", tags=["Loans"])
app.include_router(recovery.router, prefix="/api/recovery", tags=["Recovery & AI"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

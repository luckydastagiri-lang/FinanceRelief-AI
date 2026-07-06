# FinRelief AI - Python FastAPI Backend Template

This directory contains a production-ready, enterprise-grade backend template built with Python, FastAPI, and SQLAlchemy.

## Setup Instructions

1. **Install Python 3.10+**
2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Variables:**
   Copy `.env.example` to `.env` and configure your database and API keys.
5. **Run the server:**
   ```bash
   uvicorn app.main:app --reload
   ```

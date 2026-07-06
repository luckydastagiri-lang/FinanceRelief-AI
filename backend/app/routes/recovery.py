from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models.models import Loan, SessionLocal
from ..schemas.schemas import SettlementAnalyzeRequest, LetterGenerateRequest
from .loans import get_current_user, get_db
from ..ai.gemini import generate_settlement_recommendation, generate_hardship_letter

router = APIRouter()

@router.post("/analyze")
def analyze_settlement(req: SettlementAnalyzeRequest, db: Session = Depends(get_db)):
    loan = db.query(Loan).filter(Loan.id == req.loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Mock data for income/expenses
    income = 2000000
    expenses = 500000
    
    # Call Gemini AI
    result = generate_settlement_recommendation(loan.amount, loan.overdue_months, income, expenses)
    return result

@router.post("/generate_letter")
def generate_letter(req: LetterGenerateRequest, db: Session = Depends(get_db)):
    loan = db.query(Loan).filter(Loan.id == req.loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
        
    letter = generate_hardship_letter(req.strategy, loan.amount, loan.overdue_months)
    return {"letter_content": letter}

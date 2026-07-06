from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..models.models import Loan, User, SessionLocal
from ..schemas.schemas import LoanCreate, LoanResponse
from .auth import oauth2_scheme, get_db # simplified import

router = APIRouter()

# Mock get_current_user for template purposes
def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    # In a real app, decode token and fetch user
    user = db.query(User).first() 
    if not user:
        raise HTTPException(status_code=401)
    return user

@router.get("/", response_model=List[LoanResponse])
def get_loans(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    loans = db.query(Loan).filter(Loan.owner_id == current_user.id).all()
    return loans

@router.post("/", response_model=LoanResponse)
def create_loan(loan: LoanCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_loan = Loan(**loan.model_dump(), owner_id=current_user.id)
    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    return new_loan

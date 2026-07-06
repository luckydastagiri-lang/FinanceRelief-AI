from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoanCreate(BaseModel):
    name: str
    amount: float
    interest_rate: float
    overdue_months: int

class LoanResponse(LoanCreate):
    id: int
    owner_id: int
    class Config:
        from_attributes = True

class SettlementAnalyzeRequest(BaseModel):
    loan_id: int

class LetterGenerateRequest(BaseModel):
    loan_id: int
    strategy: str

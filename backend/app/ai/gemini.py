import os
import json
from google import genai
from google.genai import types

def get_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    return genai.Client(api_key=api_key)

def generate_settlement_recommendation(amount: float, overdue_months: int, income: float, expenses: float):
    client = get_client()
    if not client:
        return {"settlement_recommendation": "50%", "actionable_steps": ["API Key not configured"]}

    prompt = f"""
    Analyze this debt:
    Amount: {amount}
    Overdue Months: {overdue_months}
    User Monthly Income: {income}
    User Monthly Expenses: {expenses}
    
    Provide a realistic settlement percentage and 3 actionable steps in JSON format:
    {{
        "settlement_recommendation": "XX%",
        "actionable_steps": ["step1", "step2", "step3"]
    }}
    """
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2
            )
        )
        return json.loads(response.text)
    except Exception as e:
        return {"settlement_recommendation": "N/A", "actionable_steps": [f"Error: {str(e)}"]}

def generate_hardship_letter(strategy: str, amount: float, overdue_months: int):
    client = get_client()
    if not client:
        return "API Key not configured. Please set GEMINI_API_KEY."
        
    prompt = f"Write a professional {strategy} hardship letter to a creditor for a debt of {amount} that is {overdue_months} months overdue."
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Error generating letter: {str(e)}"

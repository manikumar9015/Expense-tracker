
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import List
from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch
from collections import defaultdict

router = APIRouter()

# Load model and tokenizer only once
model_path = r"C:\Users\manik\Desktop\expense_tracker\app\finreport-model"
model = T5ForConditionalGeneration.from_pretrained(model_path)
tokenizer = T5Tokenizer.from_pretrained(model_path)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# ----------------------------
# Define Transaction Schema
# ----------------------------
class Transaction(BaseModel):
    description: str
    amount: float
    type: str
    category: str
    date: str

class ReportRequest(BaseModel):
    transactions: List[Transaction]

# ----------------------------
# Preprocessing Function
# ----------------------------
def summarize_input(transactions: List[Transaction]):
    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")
    net = total_income - total_expense

    category_totals = defaultdict(float)
    for t in transactions:
        if t.type == "expense":
            category_totals[t.category] += t.amount

    top_category = max(category_totals, key=category_totals.get, default="N/A")

    return f"summarize: total_income={total_income:.2f} total_expenses={total_expense:.2f} net_saving={net:.2f} top_category={top_category}"

# ----------------------------
# POST /analyze-report
# ----------------------------
@router.post("/analyze-report")
async def analyze_report(req: ReportRequest):
    try:
        input_str = summarize_input(req.transactions)
        inputs = tokenizer(input_str, return_tensors="pt", truncation=True, max_length=128).to(device)
        outputs = model.generate(inputs.input_ids, max_length=128, num_beams=4, early_stopping=True)
        summary = tokenizer.decode(outputs[0], skip_special_tokens=True)

        return {"summary": summary}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

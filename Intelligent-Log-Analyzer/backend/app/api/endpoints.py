from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from datetime import datetime
from typing import List

from app.models.schemas import LogUploadResponse, AnalysisReport, HealthCheck, ChatRequest, ChatResponse
from app.services.log_service import LogService

router = APIRouter()
log_service = LogService()

@router.get("/health", response_model=HealthCheck)
async def health():
    return HealthCheck(status="healthy")

@router.post("/upload-log", response_model=LogUploadResponse)
async def upload_log(file: UploadFile = File(...)):
    if not file.filename.endswith(('.log', '.txt')):
        raise HTTPException(status_code=400, detail="Invalid file format. Only .log and .txt are allowed.")
    
    content = await file.read()
    log_id = await log_service.save_log(file.filename, content)
    
    return LogUploadResponse(
        log_id=log_id,
        filename=file.filename,
        timestamp=datetime.now()
    )

@router.post("/analyze-log/{log_id}", response_model=AnalysisReport)
async def analyze_log(log_id: str):
    report = await log_service.run_analysis(log_id)
    if not report:
        raise HTTPException(status_code=404, detail="Log file not found.")
    return report

@router.get("/report/{log_id}", response_model=AnalysisReport)
async def get_report(log_id: str):
    report = log_service.get_report(log_id)
    if not report:
        raise HTTPException(status_code=404, detail="Analysis report not found. You might need to trigger analysis first.")
    return report

@router.post("/chat/{log_id}", response_model=ChatResponse)
async def chat(log_id: str, request: ChatRequest):
    response_text = await log_service.chat_with_log(log_id, request.message)
    return ChatResponse(response=response_text)

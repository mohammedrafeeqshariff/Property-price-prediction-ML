from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class LogUploadResponse(BaseModel):
    log_id: str
    filename: str
    timestamp: datetime

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class ClusterData(BaseModel):
    error: str
    occurrences: int
    service: str
    level: str
    sample_timestamp: Optional[str] = None

class TimelineEvent(BaseModel):
    time: str
    level: str
    message: str

class AnalysisReport(BaseModel):
    log_id: str
    debugging_summary: str
    root_cause: str
    severity_level: str
    severity_score: int
    recommended_fix: str
    debug_steps: List[str]
    clustered_errors: List[ClusterData] = []
    timeline: List[TimelineEvent] = []
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.now)

class HealthCheck(BaseModel):
    status: str
    version: str = "1.0.0"

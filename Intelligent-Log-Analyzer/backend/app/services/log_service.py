import uuid
import os
import shutil
import json
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, Any, Tuple

from app.config.settings import settings
from app.parsers.engine import LogParserEngine
from app.clustering.engine import ClusteringEngine
from app.timeline.builder import TimelineBuilder
from app.severity.engine import SeverityEngine
from app.llm.analyzer import AIAnalyzer
from app.models.schemas import AnalysisReport

class LogService:
    """
    Orchestrates the lifecycle of log files: storage, parsing, and analysis.
    """
    
    def __init__(self):
        self.storage_path = settings.storage_path
        self.reports_path = self.storage_path / "reports"
        self.reports_path.mkdir(exist_ok=True)
        self.ai_analyzer = AIAnalyzer()

    async def save_log(self, filename: str, content: bytes) -> str:
        """
        Saves uploaded log file and returns a unique log_id.
        """
        log_id = str(uuid.uuid4())
        file_path = self.storage_path / f"{log_id}_{filename}"
        
        with open(file_path, "wb") as f:
            f.write(content)
            
        return log_id

    def get_log_content(self, log_id: str) -> Optional[str]:
        """
        Retrieves the content of a previously uploaded log.
        """
        # Look for file starting with log_id
        for file in self.storage_path.glob(f"{log_id}_*"):
            if file.is_file():
                return file.read_text(errors='ignore')
        return None

    async def run_analysis(self, log_id: str) -> Optional[AnalysisReport]:
        """
        Parses logs and runs AI analysis, storing the result.
        """
        content = self.get_log_content(log_id)
        if not content:
            return None
            
        # 1. Parse logs (Multi-format)
        parser = LogParserEngine(content)
        parsed_logs = parser.parse()
        
        # 2. Extract components
        cluster_engine = ClusteringEngine(parsed_logs)
        clustered_errors = cluster_engine.cluster()
        
        timeline_builder = TimelineBuilder(parsed_logs)
        timeline = timeline_builder.build()
        
        severity_engine = SeverityEngine(clustered_errors)
        severity_score, severity_level = severity_engine.score()
        
        # 3. AI Analysis
        ai_results = await self.ai_analyzer.analyze_logs(
            clustered_errors=clustered_errors[:20], # limit to avoid hitting token limits
            timeline=timeline,
            severity_score=severity_score,
            severity_level=severity_level
        )
        
        # 4. Create Report
        report = AnalysisReport(
            log_id=log_id,
            debugging_summary=ai_results.get("debugging_summary", "No summary provided."),
            root_cause=ai_results.get("root_cause", "Unknown"),
            severity_level=severity_level,
            severity_score=severity_score,
            recommended_fix=ai_results.get("recommended_fix", "No recommendation"),
            debug_steps=ai_results.get("debug_steps", []),
            clustered_errors=clustered_errors,
            timeline=timeline,
            metadata={
                "parsed_log_count": len(parsed_logs),
                "cluster_count": len(clustered_errors)
            }
        )
        
        # 5. Save Report
        report_file = self.reports_path / f"{log_id}.json"
        report_file.write_text(report.model_dump_json())
        
        return report

    def get_report(self, log_id: str) -> Optional[AnalysisReport]:
        """
        Retrieves a saved analysis report.
        """
        report_file = self.reports_path / f"{log_id}.json"
        if report_file.exists():
            data = json.loads(report_file.read_text())
            return AnalysisReport(**data)
        return None
        
    async def chat_with_log(self, log_id: str, message: str) -> str:
        report = self.get_report(log_id)
        if not report:
            return "Log report not found to chat with."
            
        context = {
            "summary": report.debugging_summary,
            "root_cause": report.root_cause,
            "fix": report.recommended_fix,
            "clusters": [c.model_dump() for c in report.clustered_errors[:10]],
            "timeline": [t.model_dump() for t in report.timeline]
        }
        
        return await self.ai_analyzer.chat(context, message)

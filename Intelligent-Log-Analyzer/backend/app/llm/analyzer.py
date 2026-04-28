import google.generativeai as genai
import json
import logging
from typing import Dict, Any, Optional, List
from app.config.settings import settings

logger = logging.getLogger(__name__)

class AIAnalyzer:
    """
    Service to interface with Google Gemini API for log analysis.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            logger.warning("GEMINI_API_KEY not set. AI analysis will fail.")
            self.model = None

    async def analyze_logs(self, clustered_errors: List[Dict[str, Any]], timeline: List[Dict[str, str]], severity_score: int, severity_level: str) -> Dict[str, Any]:
        """
        Sends structured logs to Gemini and returns structured debugging insights.
        """
        if not self.model:
            return {
                "error": "AI Analyzer not configured. Please provide a GEMINI_API_KEY.",
                "debugging_summary": "System error. API Key missing.",
                "root_cause": "Configuration Error",
                "severity_level": "N/A",
                "severity_score": 0,
                "recommended_fix": "Set GEMINI_API_KEY in environment variables.",
                "debug_steps": []
            }

        prompt = f"""
        You are a senior DevOps engineer and SRE specializing in log analysis.
        Analyze the following structured log data and provide a detailed debugging report.
        
        SEVERITY: {severity_level} (Score: {severity_score}/100)
        
        CLUSTERED ERRORS (Top issues):
        {json.dumps(clustered_errors, indent=2)}
        
        INCIDENT TIMELINE:
        {json.dumps(timeline, indent=2)}
        
        RESPONSE REQUIREMENTS:
        - Return the response ONLY in valid JSON format.
        - Provide a high-level summary of what happened.
        - Analyze the most likely root causes.
        - Recommend specific fixes (include actionable commands if applicable).
        - Detail specific debugging steps.
        
        EXPECTED JSON FORMAT:
        {{
            "debugging_summary": "High level summary of the incident",
            "root_cause": "Detailed explanation of what went wrong",
            "recommended_fix": "Primary fix recommendation including code or terminal commands",
            "debug_steps": [
                "Step 1 to investigate/verify",
                "Step 2 to investigate/verify"
            ]
        }}
        """

        try:
            response = self.model.generate_content(prompt)
            # Find JSON block if LLM added markdown
            text = response.text
            if "```json" in text:
                text = text.split("```json")[-1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[-1].split("```")[0].strip()
            
            return json.loads(text)
        except Exception as e:
            logger.error(f"AI Analysis failed: {e}")
            return {
                "error": f"Failed to analyze logs through AI: {str(e)}",
                "debugging_summary": "Analysis failed due to an exception in the LLM pipeline.",
                "root_cause": "Analysis Pipeline Failure",
                "severity_level": "Low",
                "severity_score": 0,
                "recommended_fix": "Retry analysis or check API quota.",
                "debug_steps": ["Check Gemini API status", "Verify log content size/types"]
            }

    async def chat(self, log_context: Dict[str, Any], user_message: str) -> str:
        """
        AI Log Chat Feature
        """
        if not self.model:
            return "AI Analyzer not configured."
            
        prompt = f"""
        You are an AI assistant helping a DevOps engineer debug an issue.
        Here is the context of the incident:
        {json.dumps(log_context, indent=2)}
        
        User Question: {user_message}
        
        Provide a helpful, precise answer based on the context. If you don't know, say so.
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error connecting to AI: {str(e)}"

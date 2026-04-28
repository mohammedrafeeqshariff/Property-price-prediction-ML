import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.ai_analyzer.analyzer import AIAnalyzer

@pytest.mark.asyncio
async def test_ai_analyzer_success():
    # Mock settings and genai
    with patch("app.ai_analyzer.analyzer.settings") as mock_settings, \
         patch("google.generativeai.GenerativeModel") as mock_model_class:
        
        mock_settings.GEMINI_API_KEY = "test_key"
        mock_model = MagicMock()
        mock_model_class.return_value = mock_model
        
        # Mock LLM response
        mock_response = MagicMock()
        mock_response.text = '{"root_cause": "Test Cause", "severity": "Low", "recommended_fix": "Fix it", "debug_steps": ["Step 1"]}'
        mock_model.generate_content.return_value = mock_response
        
        analyzer = AIAnalyzer(api_key="test_key")
        result = await analyzer.analyze_logs("Some summary")
        
        assert result["root_cause"] == "Test Cause"
        assert result["severity"] == "Low"
        assert result["debug_steps"] == ["Step 1"]

@pytest.mark.asyncio
async def test_ai_analyzer_missing_key():
    with patch("app.ai_analyzer.analyzer.settings") as mock_settings:
        mock_settings.GEMINI_API_KEY = ""
        analyzer = AIAnalyzer(api_key="")
        result = await analyzer.analyze_logs("Some summary")
        
        assert "error" in result
        assert "GEMINI_API_KEY" in result["recommended_fix"]

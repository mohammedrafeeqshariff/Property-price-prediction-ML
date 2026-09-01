"""LangChain Property Agent Orchestrator.

Combines LLM, Tools, Memory, and System Persona for Melbourne Real Estate Advisory.
"""

import os
from typing import Dict, Any, List, Optional
from langgraph.prebuilt import create_react_agent
from src.llm.providers import get_llm
from src.llm.prompts import SYSTEM_AGENT_PROMPT
from src.agent.tools import get_agent_tools


class PropertyAgent:
    """Agent that orchestrates ML valuation, RAG knowledge retrieval, and mortgage planning."""

    def __init__(
        self,
        provider: str = "ollama",
        model_name: Optional[str] = None,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        temperature: float = 0.2,
    ):
        self.provider = provider
        self.model_name = model_name
        self.llm = get_llm(
            provider=provider,
            model_name=model_name,
            api_key=api_key,
            base_url=base_url,
            temperature=temperature,
        )
        self.tools = get_agent_tools()
        self.agent_executor = create_react_agent(
            model=self.llm,
            tools=self.tools,
            prompt=SYSTEM_AGENT_PROMPT,
        )
        self.chat_history: List[Dict[str, str]] = []

    def run(self, user_query: str) -> Dict[str, Any]:
        """Executes the agent workflow on a user query."""
        try:
            messages = [
                {"role": "system", "content": SYSTEM_AGENT_PROMPT},
                *[{"role": h["role"], "content": h["content"]} for h in self.chat_history[-6:]],
                {"role": "user", "content": user_query},
            ]
            result = self.agent_executor.invoke({"messages": messages})
            last_msg = result["messages"][-1]
            response_text = last_msg.content if hasattr(last_msg, "content") else str(last_msg)

            self.chat_history.append({"role": "user", "content": user_query})
            self.chat_history.append({"role": "assistant", "content": response_text})

            return {
                "query": user_query,
                "response": response_text,
                "status": "success",
            }
        except Exception as e:
            # Resilient fallback: direct LLM generation if tool loop had parsing issue
            try:
                prompt_text = f"{SYSTEM_AGENT_PROMPT}\n\nUser Question: {user_query}\n\nProvide direct analysis:"
                direct_resp = self.llm.invoke(prompt_text)
                text = direct_resp.content if hasattr(direct_resp, "content") else str(direct_resp)
                return {
                    "query": user_query,
                    "response": text,
                    "status": "fallback",
                    "note": f"Handled via direct reasoning ({str(e)})",
                }
            except Exception as inner_e:
                return {
                    "query": user_query,
                    "response": f"Error during agent execution: {str(e)} (Fallback error: {str(inner_e)})",
                    "status": "error",
                }

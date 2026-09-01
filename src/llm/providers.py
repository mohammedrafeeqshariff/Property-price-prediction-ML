"""Multi-Provider LLM & Embedding Factory.

Supports:
- Ollama (100% Free / Local Models: llama3.2, mistral, gemma2, etc.)
- OpenAI / OpenAI-Compatible (Free tiers like Groq, OpenRouter, or OpenAI API)
- Hugging Face (Free local embeddings: all-MiniLM-L6-v2 + HF Hub Inference)
"""

import os
from typing import Optional, Any
from dotenv import load_dotenv

load_dotenv()


def get_llm(
    provider: str = "ollama",
    model_name: Optional[str] = None,
    api_key: Optional[str] = None,
    base_url: Optional[str] = None,
    temperature: float = 0.2,
) -> Any:
    """Return a configured LangChain Chat Model instance based on provider."""
    provider = (provider or "ollama").lower().strip()

    if provider == "ollama":
        model = model_name or os.getenv("OLLAMA_MODEL", "llama3.2")
        host = base_url or os.getenv("OLLAMA_HOST", "http://localhost:11434")
        try:
            from langchain_ollama import ChatOllama
            return ChatOllama(model=model, base_url=host, temperature=temperature)
        except ImportError:
            try:
                from langchain_community.chat_models import ChatOllama
                return ChatOllama(model=model, base_url=host, temperature=temperature)
            except Exception as e:
                # Fallback to OpenAI-compatible endpoint for Ollama
                from langchain_openai import ChatOpenAI
                return ChatOpenAI(
                    model=model,
                    openai_api_key="ollama",
                    openai_api_base=f"{host}/v1",
                    temperature=temperature,
                )

    elif provider in ("openai", "groq", "openrouter"):
        key = api_key or os.getenv("OPENAI_API_KEY")
        if provider == "groq":
            default_base = "https://api.groq.com/openai/v1"
            default_model = "llama-3.3-70b-versatile"
            key = key or os.getenv("GROQ_API_KEY")
        elif provider == "openrouter":
            default_base = "https://openrouter.ai/api/v1"
            default_model = "meta-llama/llama-3.2-3b-instruct:free"
            key = key or os.getenv("OPENROUTER_API_KEY")
        else:
            default_base = None
            default_model = "gpt-4o-mini"

        endpoint = base_url or os.getenv("OPENAI_BASE_URL", default_base)
        model = model_name or os.getenv("OPENAI_MODEL", default_model)

        from langchain_openai import ChatOpenAI
        kwargs = {"model": model, "temperature": temperature}
        if key:
            kwargs["api_key"] = key
        if endpoint:
            kwargs["base_url"] = endpoint

        return ChatOpenAI(**kwargs)

    elif provider in ("huggingface", "hf"):
        token = api_key or os.getenv("HUGGINGFACEHUB_API_TOKEN")
        model = model_name or "HuggingFaceH4/zephyr-7b-beta"
        try:
            from langchain_community.llms import HuggingFaceEndpoint
            return HuggingFaceEndpoint(
                repo_id=model,
                huggingfacehub_api_token=token,
                temperature=temperature,
            )
        except Exception:
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(model="gpt-4o-mini", temperature=temperature)

    else:
        raise ValueError(f"Unsupported LLM provider: {provider}")


def get_embeddings(
    provider: str = "huggingface",
    model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
) -> Any:
    """Return an embedding function (HuggingFace local embeddings by default)."""
    provider = provider.lower().strip()
    if provider in ("huggingface", "hf", "local"):
        try:
            from langchain_huggingface import HuggingFaceEmbeddings
            return HuggingFaceEmbeddings(model_name=model_name)
        except ImportError:
            try:
                from langchain_community.embeddings import HuggingFaceEmbeddings
                return HuggingFaceEmbeddings(model_name=model_name)
            except Exception:
                # Fast fallback embeddings using sentence-transformers directly or fake embeddings
                pass

    if provider == "openai":
        from langchain_openai import OpenAIEmbeddings
        return OpenAIEmbeddings()

    # Standard fallback
    try:
        from langchain_community.embeddings import HuggingFaceEmbeddings
        return HuggingFaceEmbeddings(model_name=model_name)
    except Exception:
        from langchain_community.embeddings import FakeEmbeddings
        return FakeEmbeddings(size=384)

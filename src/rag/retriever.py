"""Retriever module for Melbourne Property Knowledge Base (ChromaDB).

Provides semantic retrieval over 'melbourne_property_kb' collection.
"""

import os
from typing import List, Dict, Any, Optional
from langchain_core.documents import Document
from src.llm.providers import get_embeddings
from src.rag.ingest import VECTOR_STORE_DIR, COLLECTION_NAME, ingest_melbourne_data


_VECTORSTORE_CACHE = None


def get_property_vectorstore(force_reload: bool = False):
    """Load or initialize the ChromaDB vector store."""
    global _VECTORSTORE_CACHE
    if _VECTORSTORE_CACHE is not None and not force_reload:
        return _VECTORSTORE_CACHE

    from langchain_community.vectorstores import Chroma

    embeddings = get_embeddings(provider="huggingface")

    if not os.path.exists(VECTOR_STORE_DIR) or not os.listdir(VECTOR_STORE_DIR):
        print(f"Vector store directory empty. Ingesting data automatically...")
        _VECTORSTORE_CACHE = ingest_melbourne_data(
            persist_directory=VECTOR_STORE_DIR,
            collection_name=COLLECTION_NAME,
        )
        return _VECTORSTORE_CACHE

    _VECTORSTORE_CACHE = Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=VECTOR_STORE_DIR,
    )
    return _VECTORSTORE_CACHE


def get_property_retriever(k: int = 4, filter_dict: Optional[Dict[str, Any]] = None):
    """Return a LangChain retriever object with optional metadata filtering."""
    store = get_property_vectorstore()
    search_kwargs = {"k": k}
    if filter_dict:
        search_kwargs["filter"] = filter_dict
    return store.as_retriever(search_kwargs=search_kwargs)


def search_property_knowledge(query: str, k: int = 4) -> Dict[str, Any]:
    """Perform similarity search with relevance scores and return formatted context."""
    store = get_property_vectorstore()
    try:
        results_with_scores = store.similarity_search_with_relevance_scores(query, k=k)
    except Exception:
        # Fallback if relevance score is not directly supported by current distance metric
        docs = store.similarity_search(query, k=k)
        results_with_scores = [(doc, 1.0) for doc in docs]

    formatted_docs = []
    contexts = []

    for doc, score in results_with_scores:
        suburb = doc.metadata.get("suburb", "General")
        contexts.append(f"--- Document [Suburb: {suburb} | Relevance: {score:.2f}] ---\n{doc.page_content}")
        formatted_docs.append({
            "content": doc.page_content,
            "metadata": doc.metadata,
            "score": score,
        })

    return {
        "query": query,
        "context": "\n\n".join(contexts),
        "documents": formatted_docs,
    }

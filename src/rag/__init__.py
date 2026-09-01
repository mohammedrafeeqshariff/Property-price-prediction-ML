"""RAG (Retrieval-Augmented Generation) module for Melbourne Property Market."""

__all__ = [
    "ingest_melbourne_data",
    "get_property_vectorstore",
    "search_property_knowledge",
]


def __getattr__(name):
    if name == "ingest_melbourne_data":
        from src.rag.ingest import ingest_melbourne_data
        return ingest_melbourne_data
    elif name in ("get_property_vectorstore", "search_property_knowledge"):
        from src.rag.retriever import get_property_vectorstore, search_property_knowledge
        return globals()[name] if name in globals() else (get_property_vectorstore if name == "get_property_vectorstore" else search_property_knowledge)
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")

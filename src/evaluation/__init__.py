"""Automated Evaluation Suite for RAG, Agent, and Guardrails."""

__all__ = ["run_full_evaluation"]


def __getattr__(name):
    if name == "run_full_evaluation":
        from src.evaluation.eval_suite import run_full_evaluation
        return run_full_evaluation
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")

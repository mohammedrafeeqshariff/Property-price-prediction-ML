"""Input and Output Guardrails for the Real Estate AI Application.

Ensures:
1. Input safety, prompt injection filtering, and real estate domain relevance.
2. Output sanity checks, price bounds validation, and legal compliance disclaimers.
"""

import re
from typing import Dict, Any, Optional
from dataclasses import dataclass

# Off-topic and malicious patterns
PROMPT_INJECTION_PATTERNS = [
    r"ignore (all )?previous instructions",
    r"disregard (all )?prior instructions",
    r"system prompt override",
    r"you are now in developer mode",
    r"bypass safety protocols",
    r"jailbreak",
    r"<script.*?>",
    r"eval\(",
]

# Real estate related terms to establish domain relevance
DOMAIN_KEYWORDS = [
    "property", "house", "unit", "apartment", "townhouse", "price", "valuation",
    "cost", "buy", "sell", "rent", "suburb", "melbourne", "mortgage", "loan",
    "deposit", "interest", "bedroom", "bathroom", "land", "area", "market",
    "trend", "richmond", "abbotsford", "reservoir", "cbd", "stamp duty", "investment",
    "afford", "yield", "growth", "rooms", "garage", "sqm", "estimate"
]

MIN_REALISTIC_PRICE = 50_000
MAX_REALISTIC_PRICE = 50_000_000

DISCLAIMER_TEXT = (
    "\n\n---\n*ℹ️ Disclaimer: Property valuations and market insights provided by Aura AI "
    "are algorithmic estimates based on historical Melbourne sales data and Machine Learning models. "
    "This does not constitute formal financial, taxation, or certified appraisal advice.*"
)


@dataclass
class GuardrailResult:
    is_valid: bool
    sanitized_text: str
    reason: Optional[str] = None
    flags: Optional[Dict[str, Any]] = None


def validate_input_query(query: str, enforce_domain: bool = True) -> GuardrailResult:
    """Validates user input against prompt injection and domain irrelevance."""
    if not query or not query.strip():
        return GuardrailResult(
            is_valid=False,
            sanitized_text="",
            reason="Query is empty.",
            flags={"error": "empty_input"}
        )

    clean_text = query.strip()

    # 1. Prompt Injection & Malicious Pattern Check
    for pattern in PROMPT_INJECTION_PATTERNS:
        if re.search(pattern, clean_text, re.IGNORECASE):
            return GuardrailResult(
                is_valid=False,
                sanitized_text=clean_text,
                reason="Potential prompt injection or unsupported command detected. Please ask a property-related question.",
                flags={"security_threat": True, "pattern": pattern}
            )

    # 2. Domain Relevance Check
    if enforce_domain and len(clean_text.split()) > 3:
        has_domain_keyword = any(
            re.search(rf"\b{kw}\b", clean_text, re.IGNORECASE) for kw in DOMAIN_KEYWORDS
        )
        if not has_domain_keyword:
            # Let general polite greetings pass
            greetings = ["hello", "hi", "hey", "help", "who are you", "what can you do"]
            if not any(re.search(rf"\b{g}\b", clean_text, re.IGNORECASE) for g in greetings):
                return GuardrailResult(
                    is_valid=False,
                    sanitized_text=clean_text,
                    reason="Query appears off-topic. Please ask about Melbourne property prices, suburbs, valuations, or mortgages.",
                    flags={"off_topic": True}
                )

    return GuardrailResult(is_valid=True, sanitized_text=clean_text)


def validate_price_bounds(price: float) -> GuardrailResult:
    """Ensures property price predictions fall within realistic bounds."""
    if price < MIN_REALISTIC_PRICE:
        return GuardrailResult(
            is_valid=False,
            sanitized_text=f"${price:,.0f}",
            reason=f"Predicted price (${price:,.0f}) is below realistic threshold (${MIN_REALISTIC_PRICE:,}).",
            flags={"out_of_bounds": "too_low"}
        )
    if price > MAX_REALISTIC_PRICE:
        return GuardrailResult(
            is_valid=False,
            sanitized_text=f"${price:,.0f}",
            reason=f"Predicted price (${price:,.0f}) exceeds realistic threshold (${MAX_REALISTIC_PRICE:,}).",
            flags={"out_of_bounds": "too_high"}
        )
    return GuardrailResult(is_valid=True, sanitized_text=f"${price:,.0f}")


def validate_output_response(response_text: str, append_disclaimer: bool = True) -> GuardrailResult:
    """Validates output response completeness and attaches regulatory disclaimer."""
    if not response_text or not response_text.strip():
        return GuardrailResult(
            is_valid=False,
            sanitized_text="Unable to generate valuation response. Please try again.",
            reason="Empty model response.",
        )

    clean_resp = response_text.strip()
    if append_disclaimer and DISCLAIMER_TEXT.strip() not in clean_resp:
        clean_resp += DISCLAIMER_TEXT

    return GuardrailResult(is_valid=True, sanitized_text=clean_resp)

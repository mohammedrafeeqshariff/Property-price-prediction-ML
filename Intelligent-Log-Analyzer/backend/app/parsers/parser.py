import re
from typing import List, Dict, Any, Optional
from collections import Counter

class LogParser:
    """
    Module for parsing raw log files, extracting errors/warnings,
    and grouping them for analysis.
    """
    
    # Common log patterns
    PATTERNS = {
        'ERROR': r'(?i)ERROR[:\s]+(.*)',
        'WARNING': r'(?i)WARNING[:\s]+(.*)',
        'CRITICAL': r'(?i)CRITICAL[:\s]+(.*)',
        'EXCEPTION': r'(?i)EXCEPTION[:\s]+(.*)',
        'TIMESTAMP': r'\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}'
    }

    def __init__(self, log_content: str):
        self.log_content = log_content
        self.lines = log_content.splitlines()

    def extract_errors(self) -> List[Dict[str, Any]]:
        """
        Extracts lines containing error-level indicators.
        """
        extracted = []
        for line in self.lines:
            found = False
            for level, pattern in self.PATTERNS.items():
                if level in ['TIMESTAMP']: continue # Skip metadata patterns
                
                match = re.search(pattern, line)
                if match:
                    extracted.append({
                        "level": level,
                        "message": match.group(1).strip() if match.groups() else line.strip(),
                        "raw_line": line.strip()
                    })
                    found = True
                    break
            
            # Simple fallback for standard "Exception" traces if not caught by regex
            if not found and "Exception:" in line:
                extracted.append({
                    "level": "EXCEPTION",
                    "message": line.strip(),
                    "raw_line": line.strip()
                })
        
        return extracted

    def group_errors(self, extracted_errors: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Groups identical or highly similar error messages.
        """
        counts = Counter()
        samples = {}
        levels = {}

        for err in extracted_errors:
            # Basic normalization: remove trailing hex IDs or numbers to group similar errors
            msg = err['message']
            normalized_msg = re.sub(r'0x[0-9a-fA-F]+', '<HEX>', msg)
            normalized_msg = re.sub(r'\d+', '<NUM>', normalized_msg)
            
            counts[normalized_msg] += 1
            if normalized_msg not in samples:
                samples[normalized_msg] = err['raw_line']
                levels[normalized_msg] = err['level']

        grouped = []
        for msg, count in counts.items():
            grouped.append({
                "error_type": msg[:100] + ("..." if len(msg) > 100 else ""),
                "occurrences": count,
                "sample_log": samples[msg],
                "level": levels[msg]
            })
        
        # Sort by occurrences descending
        return sorted(grouped, key=lambda x: x['occurrences'], reverse=True)

    def get_summary_for_llm(self, limit: int = 10) -> str:
        """
        Prepares a condensed string representation of the grouped errors for LLM processing.
        """
        errors = self.extract_errors()
        grouped = self.group_errors(errors)
        
        summary_lines = [f"Found {len(errors)} error-level events in log."]
        summary_lines.append(f"Top {min(limit, len(grouped))} unique issues:")
        
        for item in grouped[:limit]:
            summary_lines.append(f"- [{item['level']}] (x{item['occurrences']}) {item['sample_log']}")
            
        summary = "\n".join(summary_lines)
        print(f"--- LOG PARSER SUMMARY ---\n{summary}\n--------------------------", flush=True)
        return summary

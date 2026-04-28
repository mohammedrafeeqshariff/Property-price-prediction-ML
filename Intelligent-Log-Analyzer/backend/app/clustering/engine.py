import re
from typing import List, Dict, Any
from collections import Counter

class ClusteringEngine:
    """
    Groups identical or highly similar errors, counts occurrences,
    and removes duplicate lines to reduce LLM token usage.
    """
    
    def __init__(self, parsed_logs: List[Dict[str, str]]):
        self.parsed_logs = parsed_logs
        
    def cluster(self) -> List[Dict[str, Any]]:
        # Filter to only consider warnings and errors
        error_logs = [log for log in self.parsed_logs if log.get('level') in ['WARNING', 'ERROR', 'CRITICAL', 'FATAL', 'WARN']]
        
        counts = Counter()
        samples = {}
        
        for log in error_logs:
            msg = log.get('message', '')
            
            # Normalize to group similar errors: 
            # Remove hex codes, numbers, specific UUIDs or IDs in messages
            normalized_msg = re.sub(r'0x[0-9a-fA-F]+', '<HEX>', msg)
            normalized_msg = re.sub(r'\b\d+\b', '<NUM>', normalized_msg)
            normalized_msg = re.sub(r'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}', '<UUID>', normalized_msg)
            
            # Keep it concise
            normalized_msg = normalized_msg[:200]
            
            counts[normalized_msg] += 1
            if normalized_msg not in samples:
                samples[normalized_msg] = {
                    "error": msg,
                    "service": log.get('service', 'unknown'),
                    "level": log.get('level', 'ERROR'),
                    "sample_timestamp": log.get('timestamp')
                }
                
        results = []
        for msg, count in counts.items():
            entry = samples[msg]
            entry['occurrences'] = count
            results.append(entry)
            
        # Sort by occurrence
        return sorted(results, key=lambda x: x['occurrences'], reverse=True)

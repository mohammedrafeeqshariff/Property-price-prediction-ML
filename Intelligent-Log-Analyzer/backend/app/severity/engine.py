from typing import List, Dict, Any, Tuple

class SeverityEngine:
    """
    Scores the severity of an incident based on the frequency and level
    of log events.
    
    Levels: CRITICAL=4, ERROR=3, WARNING=1, Security=+2
    """
    
    SECURITY_KEYWORDS = ['attack', 'unauthorized', 'injection', 'breach', 'password', 'login']
    
    def __init__(self, clustered_errors: List[Dict[str, Any]]):
        self.clustered_errors = clustered_errors
        
    def score(self) -> Tuple[int, str]:
        total_score = 0
        
        for cluster in self.clustered_errors:
            level = cluster.get('level', 'INFO')
            message = cluster.get('error', '').lower()
            occurrences = cluster.get('occurrences', 1)
            
            # Base score by level
            if level in ['CRITICAL', 'FATAL']:
                base = 4
            elif level == 'ERROR':
                base = 3
            elif level in ['WARNING', 'WARN']:
                base = 1
            else:
                base = 0
                
            # Security multiplier
            if any(keyword in message for keyword in self.SECURITY_KEYWORDS):
                base += 2
                
            # Logarithmic scaling for occurrences (we don't want 10k errors to score 30k instantly)
            if occurrences > 1:
                multiplier = 1 + (occurrences ** 0.5) / 10 # Example: 100 errors -> 1 + 10/10 = 2x score
            else:
                multiplier = 1
                
            total_score += (base * multiplier)
            
        final_score = int(min(total_score, 100)) # Cap at 100
        
        if final_score >= 8:
            severity = 'CRITICAL'
        elif final_score >= 4:
            severity = 'HIGH'
        elif final_score >= 2:
            severity = 'MEDIUM'
        else:
            severity = 'LOW'
            
        return final_score, severity

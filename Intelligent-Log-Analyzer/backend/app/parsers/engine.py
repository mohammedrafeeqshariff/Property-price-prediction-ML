import re
from typing import List, Dict, Any

class LogParserEngine:
    """
    Multi-format parser for extracting timestamps, levels, services, and messages from lines of text.
    Supports NGINX, Docker, Kubernetes, and standard Python/Java app logs.
    """
    
    # Common log patterns to try (ordered from most to least specific)
    PATTERNS = [
        # Example: 2026-03-16 14:00:10 ERROR [database.query] relation users_profile does not exist
        re.compile(r'^(?P<timestamp>\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+Z?)?)\s+(?P<level>INFO|DEBUG|WARNING|WARN|ERROR|CRITICAL|FATAL)\s+\[(?P<service>[^\]]+)\]\s+(?P<message>.*)$', re.IGNORECASE),
        
        # Example: [2026-03-16 14:10:05,234] DEBUG in services.user: Fetching user details
        re.compile(r'^\[(?P<timestamp>\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:,\d+)?)\]\s+(?P<level>INFO|DEBUG|WARNING|WARN|ERROR|CRITICAL|FATAL)\s+in\s+(?P<service>[^:]+):\s+(?P<message>.*)$', re.IGNORECASE),
        
        # Example: 2026-03-16 14:05:10 UTC [10550] ERROR:  relation "users_profile" does not exist (PostgreSQL style)
        re.compile(r'^(?P<timestamp>\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\s+[a-zA-Z]+)?)\s+\[(?:\d+)\]\s+(?P<level>ERROR|FATAL|LOG|WARNING|INFO|DEBUG):\s+(?P<message>.*)$', re.IGNORECASE),
        
        # Example: Nginx style (no service but level might be error or not present)
        # 192.168.1.10 - - [16/Mar/2026:14:00:01 +0530] "GET /api/users HTTP/1.1" 200 ...
        re.compile(r'^(?P<client_ip>\d+\.\d+\.\d+\.\d+)\s+-\s+-\s+\[(?P<timestamp>[^\]]+)\]\s+"(?P<message>[^"]+)"\s+(?P<status>\d{3})\s+.*$', re.IGNORECASE),
        
        # Fallback with timestamp and level somewhere
        re.compile(r'(?P<timestamp>\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}).*?(?P<level>INFO|DEBUG|WARNING|WARN|ERROR|CRITICAL|FATAL)\s+(?P<message>.*)', re.IGNORECASE)
    ]
    
    # NGINX status to level mapping
    STATUS_TO_LEVEL = {
        '5': 'ERROR',
        '4': 'WARNING',
        '3': 'INFO',
        '2': 'INFO',
        '1': 'INFO'
    }

    def __init__(self, log_content: str):
        self.log_content = log_content
        self.lines = log_content.splitlines()

    def parse(self) -> List[Dict[str, str]]:
        parsed_logs = []
        
        # We also need to capture multi-line tracebacks
        current_log = None
        
        for line in self.lines:
            line_stripped = line.strip()
            if not line_stripped:
                continue
                
            matched = False
            for pattern in self.PATTERNS:
                match = pattern.search(line_stripped)
                if match:
                    groups = match.groupdict()
                    
                    # Nginx style mapped
                    if 'status' in groups:
                        status_code = groups['status']
                        level = self.STATUS_TO_LEVEL.get(status_code[0], 'INFO')
                        groups['level'] = 'ERROR' if status_code.startswith('5') else ('WARNING' if status_code == '403' or status_code == '401' else 'INFO')
                        groups['service'] = 'nginx/web'
                        groups['message'] = f"{groups['message']} - HTTP {status_code}"
                    
                    log_entry = {
                        "timestamp": groups.get("timestamp", "").strip(),
                        "level": groups.get("level", "INFO").upper(),
                        "service": groups.get("service", "unknown.service").strip(),
                        "message": groups.get("message", line_stripped).strip()
                    }
                    
                    if current_log:
                        parsed_logs.append(current_log)
                    current_log = log_entry
                    matched = True
                    break
            
            # If not matched, it might be a traceback or continuation of warning/error
            if not matched:
                if current_log:
                    current_log["message"] += f"\n{line_stripped}"
                else:
                    # Treat as unformatted INFO or derived from previous
                    # Catch-all
                    if "Exception" in line_stripped or "Error:" in line_stripped or "Traceback" in line_stripped:
                         current_log = {
                            "timestamp": "unknown",
                            "level": "ERROR",
                            "service": "unknown.service",
                            "message": line_stripped
                         }
                    else:
                        parsed_logs.append({
                            "timestamp": "unknown",
                            "level": "INFO",
                            "service": "unknown.service",
                            "message": line_stripped
                        })
                        
        if current_log:
            parsed_logs.append(current_log)
            
        return parsed_logs

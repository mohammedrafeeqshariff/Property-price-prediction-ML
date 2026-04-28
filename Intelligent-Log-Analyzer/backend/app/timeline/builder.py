from typing import List, Dict, Any

class TimelineBuilder:
    """
    Reconstructs the sequence of events from logs, focusing on critical events
    to build an 'Incident Timeline'
    """
    
    def __init__(self, parsed_logs: List[Dict[str, str]]):
        self.parsed_logs = parsed_logs
        
    def build(self) -> List[Dict[str, str]]:
        # Extract events with timestamps
        events = [log for log in self.parsed_logs if log.get('timestamp') and log['timestamp'] != 'unknown']
        
        # In a real environment we would convert to datetime objects for true sorting,
        # assuming basic string sorting works for ISO formats for now.
        events.sort(key=lambda x: x['timestamp'])
        
        # Filter down to interesting events
        timeline = []
        for event in events:
            if event['level'] in ['WARNING', 'WARN', 'ERROR', 'CRITICAL', 'FATAL']:
                extracted_time = event['timestamp'].split(' ')[1] if ' ' in event['timestamp'] else event['timestamp']
                
                # Truncate time to HH:MM:SS if possible
                if '.' in extracted_time:
                    extracted_time = extracted_time.split('.')[0]
                if '+' in extracted_time:
                    extracted_time = extracted_time.split('+')[0]
                    
                msg_preview = event['message'][:80] + "..." if len(event['message']) > 80 else event['message']
                    
                timeline.append({
                    "time": extracted_time,
                    "level": event['level'],
                    "message": msg_preview
                })
                
        return timeline

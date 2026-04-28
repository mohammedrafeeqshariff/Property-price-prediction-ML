import pytest
from app.log_parser.parser import LogParser

def test_extract_errors():
    log_content = """
    2023-10-01 10:00:00 INFO: App started
    2023-10-01 10:05:00 ERROR: Connection timeout
    2023-10-01 10:06:00 WARNING: Retrying...
    2023-10-01 10:10:00 ERROR: Connection timeout
    2023-10-01 10:15:00 CRITICAL: System failure
    """
    parser = LogParser(log_content)
    errors = parser.extract_errors()
    
    assert len(errors) == 4
    assert errors[0]['level'] == 'ERROR'
    assert "Connection timeout" in errors[0]['message']
    assert errors[3]['level'] == 'CRITICAL'

def test_group_errors():
    log_content = """
    ERROR: db connection fail 0x123
    ERROR: db connection fail 0x456
    ERROR: db connection fail 0x789
    WARNING: slow disk
    """
    parser = LogParser(log_content)
    errors = parser.extract_errors()
    grouped = parser.group_errors(errors)
    
    # Should be grouped into 2 unique types because 0x... are normalized
    assert len(grouped) == 2
    # The normalized msg for db connection should have 3 occurrences
    db_error = next(items for items in grouped if "db connection" in items['error_type'])
    assert db_error['occurrences'] == 3

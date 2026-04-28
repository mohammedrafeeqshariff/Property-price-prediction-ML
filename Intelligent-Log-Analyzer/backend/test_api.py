import requests
import sys

def upload_log(file_path):
    url = "http://localhost:8000/upload-log"
    with open(file_path, 'rb') as f:
        files = {'file': (file_path.split('\\')[-1], f, 'text/plain')}
        response = requests.post(url, files=files)
    print("Upload Result:")
    print(response.json())
    return response.json().get('log_id')

def analyze_log(log_id):
    url = f"http://localhost:8000/analyze-log/{log_id}"
    response = requests.post(url)
    print("\nAnalysis Result:")
    print(response.json())

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_upload.py <log_file_path>")
        sys.exit(1)
    file_id = upload_log(sys.argv[1])
    if file_id:
        analyze_log(file_id)

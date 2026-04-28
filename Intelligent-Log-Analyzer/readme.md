# Intelligent Log Analyzer 🛡️ 🚀

An AI-powered system designed for engineers to upload log files and receive instant, structured debugging insights using Google Gemini.

![Dashboard Preview](https://via.placeholder.com/800x400.png?text=Intelligent+Log+Analyzer+Dashboard)

## Features

-   **Log Upload**: Supports `.log` and `.txt` files.
-   **Smart Parsing**: Extracts ERROR, WARNING, and CRITICAL events using regex.
-   **Error Clustering**: Groups similar errors together to reduce noise for the LLM.
-   **AI Insights**: Uses Google Gemini 1.5 Flash to generate root cause analysis, severity levels, and actionable debugging steps.
-   **Structured Reports**: Clean, modular JSON-based reporting system.
-   **Modern UI**: Sleek, responsive dashboard built with a professional dark theme.
-   **Docker Ready**: Multi-container setup for easy deployment.

## Tech Stack

-   **Backend**: Python, FastAPI, Pydantic
-   **AI Layer**: Google Gemini API (`google-generativeai`)
-   **Frontend**: HTML5, Vanilla CSS3 (Modern Glassmorphism), JavaScript (Async/Fetch)
-   **Infrastructure**: Docker, Docker Compose
-   **Testing**: Pytest

## Getting Started

### Prerequisites

-   Python 3.11+
-   Docker & Docker Compose (optional)
-   [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Local Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/Intelligent-Log-Analyzer.git
    cd Intelligent-Log-Analyzer
    ```

2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure Environment**:
    Create a `.env` file from the template:
    ```bash
    cp .env.template .env
    ```
    Add your `GEMINI_API_KEY` to the `.env` file.

4.  **Run the application**:
    ```bash
    uvicorn app.main:app --reload
    ```
    Visit `http://localhost:8000` in your browser.

### Docker Setup

1.  **Create `.env` file** as described above.
2.  **Run with Docker Compose**:
    ```bash
    docker-compose up --build
    ```
    The API will be available at `http://localhost:8000`.

## API Documentation

-   `GET /health`: Health check.
-   `POST /upload-log`: Upload a `.log` or `.txt` file. Returns a `log_id`.
-   `POST /analyze-log/{log_id}`: Triggers AI analysis for the specified log.
-   `GET /report/{log_id}`: Retrieves the saved analysis report.

## Directory Structure

```text
app/
├── api/            # Route handlers
├── services/       # Business logic (LogService)
├── log_parser/     # Error extraction engine
├── ai_analyzer/    # Gemini API integration
├── models/         # Pydantic schemas
├── templates/      # Frontend HTML
└── config/         # App settings
tests/              # Pytest suite
docker/             # Docker configurations
```

## Running Tests

```bash
pytest
```

## License

MIT
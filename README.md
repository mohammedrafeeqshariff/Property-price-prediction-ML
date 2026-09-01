# Melbourne Property Price Predictor & AI Real Estate Advisor 🏡🤖

An end-to-end AI application and Decision Support System for Melbourne Property Valuations. Combines **Machine Learning (Random Forest)**, **LangChain ReAct Agent**, **Retrieval-Augmented Generation (RAG)** over a named **ChromaDB** vector collection (`melbourne_property_kb`), **Multi-Provider LLMs** (Ollama, OpenAI API, Hugging Face), **Prompt Engineering**, **Input/Output Guardrails**, and an **Automated Benchmark Evaluation Suite**.

---

## 🌟 Key Capabilities & Specifications

1. **Multi-Provider LLM Engine (100% Free / Local & Cloud)**:
   - **Ollama**: Zero-cost, local offline execution using models like `llama3.2`, `mistral`, `gemma2`, `phi3`.
   - **Hugging Face**: Free local vector embeddings with `sentence-transformers/all-MiniLM-L6-v2` + HF Hub inference option.
   - **OpenAI / Groq API**: Full compatibility with OpenAI API and free OpenAI-compatible endpoints like Groq (`llama-3.3-70b-versatile`) and OpenRouter.

2. **RAG with Named Vector Store (`melbourne_property_kb`)**:
   - Indexes historical Melbourne sales and suburb intelligence (`data/melb_data.csv`) into persistent **ChromaDB**.
   - Suburb profiles, median price benchmarks, dwelling type breakdowns (Houses, Units, Townhouses), distance-to-CBD dynamics.

3. **LangChain Agent & Tool Ecosystem**:
   - **`predict_property_price_tool`**: Direct ML Random Forest valuation engine.
   - **`search_property_knowledge_tool`**: Semantic RAG retriever querying `melbourne_property_kb`.
   - **`calculate_mortgage_tool`**: Calculates loan principal, monthly repayment amortization, and estimated Victorian stamp duty.

4. **Prompt Engineering**:
   - Valuer System Persona (`SYSTEM_AGENT_PROMPT`).
   - Few-shot valuation comparison examples.
   - Chain-of-Thought (CoT) step-by-step reasoning for valuation drivers.

5. **Guardrails & Security**:
   - **Input Guardrails**: Rejects prompt injection and out-of-domain queries.
   - **Output Guardrails**: Validates realistic price boundaries ($50k - $50M) and enforces regulatory compliance disclaimers.

6. **Automated Evaluation Benchmark Suite**:
   - One-click testing suite (`src/evaluation/eval_suite.py`) testing RAG retrieval precision, tool calculation accuracy, and security guardrail enforcement.

---

## 📁 Project Architecture

```
Property-price-predicter-ML/
├── data/
│   └── melb_data.csv               # Melbourne Housing dataset
├── output/
│   ├── model.pkl                   # Trained Random Forest model
│   └── vectorstore/                # ChromaDB named collection 'melbourne_property_kb'
├── src/
│   ├── __init__.py
│   ├── preprocessing.py            # Feature engineering pipeline
│   ├── model.py                    # Scikit-learn Random Forest training
│   ├── llm/
│   │   ├── __init__.py
│   │   ├── providers.py            # Multi-provider LLM & Embedding factory
│   │   └── prompts.py              # Prompt engineering templates (System, Few-Shot, CoT)
│   ├── rag/
│   │   ├── __init__.py
│   │   ├── ingest.py               # Vector ingestion into 'melbourne_property_kb'
│   │   └── retriever.py            # Semantic retrieval & context formatting
│   ├── agent/
│   │   ├── __init__.py
│   │   ├── tools.py                # ML prediction, RAG search & mortgage tools
│   │   └── property_agent.py       # LangChain ReAct Agent orchestrator
│   ├── guardrails/
│   │   ├── __init__.py
│   │   └── guards.py               # Input/Output validation & injection guards
│   └── evaluation/
│       ├── __init__.py
│       └── eval_suite.py           # Automated RAG, Tool & Guardrail Benchmark
├── main.py                         # Streamlit 4-Tab Web Application
├── PROJECT_UPDATES.md              # Project change log & update tracker
├── requirements.txt                # Dependencies
└── README.md                       # Documentation
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. (Optional) Run with 100% Free Local Ollama
To use offline zero-cost LLMs:
1. Install [Ollama](https://ollama.com).
2. Pull a model:
   ```bash
   ollama run llama3.2
   ```
*(Ollama will run at `http://localhost:11434` with zero API fees).*

### 3. (Optional) Configure Cloud API Keys
Create a `.env` file in the root directory:
```env
# For OpenAI API:
OPENAI_API_KEY=your_openai_api_key

# For Groq (Free Tier):
OPENAI_API_KEY=your_groq_api_key
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=llama-3.3-70b-versatile

# For Hugging Face Hub (Optional):
HUGGINGFACEHUB_API_TOKEN=your_hf_token
```

---

## 🛠️ Ingestion & Model Training

### Ingest Data into ChromaDB Vector Store
```bash
python -m src.rag.ingest
```
*Creates the named vector store `melbourne_property_kb` under `output/vectorstore/`.*

### Train the ML Random Forest Model
```bash
python -m src.model
```
*Generates `output/model.pkl`.*

---

## 🧪 Run Automated Evaluation Benchmark

```bash
python -m src.evaluation.eval_suite
```
*Executes automated test cases across RAG retrieval, Tool execution accuracy, and Guardrails.*

---

## 💻 Run Streamlit Web Application

```bash
streamlit run main.py
```
Open **http://localhost:8501** in your browser.

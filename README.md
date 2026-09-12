# 🚀 API Performance Analyzer

A lightweight **API performance testing tool** built with **FastAPI** and Python. It allows you to send multiple HTTP requests to an API endpoint and analyze its performance using latency, percentile metrics, and success rate.

The application supports both **concurrent and sequential testing** and stores test results in a SQLite database for historical analysis.

---

## ✨ Features

* ⚡ **Concurrent API Testing**

  * Sends multiple requests simultaneously using Python's asynchronous programming.

* 🔄 **Sequential API Testing**

  * Sends requests one after another for comparison with concurrent execution.

* 🌐 **Multiple HTTP Methods**

  * `GET`
  * `POST`
  * `PUT`
  * `DELETE`
  * `PATCH`

* 📊 **Performance Metrics**

  * Minimum latency
  * Maximum latency
  * Average latency
  * P95 latency
  * P99 latency
  * Success rate

* 📝 **Request Body Support**

  * Supports JSON request bodies for `POST`, `PUT`, and `PATCH` requests.

* 🗄️ **Test History**

  * Stores performance test results in a SQLite database.
  * Provides the latest 20 test results through the history endpoint.

* 🔌 **REST API**

  * Built with FastAPI.
  * Automatic interactive API documentation through Swagger UI.

* ☁️ **Deployment Ready**

  * Includes Render deployment configuration.

---

## 🛠️ Tech Stack

| Technology     | Purpose                     |
| -------------- | --------------------------- |
| **Python**     | Core programming language   |
| **FastAPI**    | REST API framework          |
| **Uvicorn**    | ASGI server                 |
| **HTTPX**      | Asynchronous HTTP requests  |
| **SQLAlchemy** | Database ORM                |
| **SQLite**     | Local database              |
| **Pydantic**   | Request/response validation |
| **Render**     | Deployment                  |

The project dependencies are defined using FastAPI, Uvicorn, HTTPX, SQLAlchemy, and Pydantic.

---

## 🏗️ Project Architecture

```text
API-PERFORMANCE-ANALYZER/
│
├── main.py
├── tester.py
├── models.py
├── schemas.py
├── database.py
├── requirements.txt
├── render.yaml
├── performance.db
├── .gitignore
└── README.md
```

### File Responsibilities

**`main.py`**

* Creates the FastAPI application.
* Defines the `/test` and `/history` endpoints.
* Validates incoming requests.
* Stores test results in the database.
  **`tester.py`**
* Executes API requests using HTTPX.
* Supports concurrent and sequential execution.
* Calculates latency and success metrics.
* Calculates P95 and P99 latency.

**`schemas.py`**

* Defines request and response models using Pydantic.
* Validates API test parameters and response structure.

**`models.py`**

* Defines the SQLAlchemy `TestResult` database model.
* Stores latency, success rate, request count, HTTP method, mode, and timestamp.

**`database.py`**

* Configures SQLAlchemy.
* Uses SQLite as the database.
* Provides database sessions to the API.

**`render.yaml`**

* Contains the Render deployment configuration.
* Installs dependencies and starts the FastAPI application with Uvicorn.

---

# ⚙️ How It Works

```text
                 ┌─────────────────────┐
                 │   User/API Client   │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │     FastAPI API     │
                 │      /test          │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Performance Tester  │
                 │      HTTPX           │
                 └──────────┬──────────┘
                            │
                  ┌─────────┴─────────┐
                  ▼                   ▼
           Concurrent Mode      Sequential Mode
                  │                   │
                  └─────────┬─────────┘
                            ▼
                 ┌─────────────────────┐
                 │ Performance Metrics │
                 │                     │
                 │ Min / Max / Average │
                 │ P95 / P99 / Success │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   SQLite Database   │
                 └─────────────────────┘
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/Ganesh10000-ai/API-PERFORMANCE-ANALYZER.git
```

```bash
cd API-PERFORMANCE-ANALYZER
```

---

## 2. Create a Virtual Environment

### Windows

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
```

```bash
source venv/bin/activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Start the Application

```bash
uvicorn main:app --reload
```

The API will start locally at:

```text
http://127.0.0.1:8000
```

---

# 📚 API Documentation

FastAPI automatically provides interactive API documentation.

### Swagger UI

Open:

```text
http://127.0.0.1:8000/docs
```

You can use Swagger UI to send performance tests directly to the application.

---

# 🧪 API Endpoints

## `POST /test`

Runs a performance test against the specified API.

### Example Request

```json
{
  "url": "https://example.com",
  "num_requests": 10,
  "mode": "concurrent",
  "method": "GET"
}
```

### Supported Modes

```text
concurrent
sequential
```

### Supported HTTP Methods

```text
GET
POST
PUT
DELETE
PATCH
```

The application validates the number of requests, execution mode, and HTTP method before running a test. The number of requests can range from **1 to 100**.

---

## `GET /history`

Returns the most recent performance test results.

The application currently returns up to **20 latest test results**, ordered by timestamp.

---

# 📊 Performance Metrics

For every performance test, the application calculates:

### Minimum Latency

The fastest successful request.

### Maximum Latency

The slowest successful request.

### Average Latency

The average response time of successful requests.

### P95 Latency

The latency value representing the 95th-percentile position of successful request latencies.

### P99 Latency

The latency value representing the 99th-percentile position of successful request latencies.

### Success Rate

```text
Success Rate = (Successful Requests / Total Requests) × 100
```

The tester records individual request latency and whether each request returned a successful `2xx` HTTP status.

---

# ⚡ Concurrent vs Sequential Testing

The analyzer provides two execution modes.

### Concurrent

Multiple requests are executed asynchronously at the same time.

```text
Request 1 ────────┐
Request 2 ────────┤
Request 3 ────────┤──► API
Request 4 ────────┤
Request 5 ────────┘
```

### Sequential

Requests are executed one after another.

```text
Request 1 ──► API
              │
Request 2 ──► API
              │
Request 3 ──► API
              │
Request 4 ──► API
```

This makes it possible to compare API behavior under sequential and concurrent workloads.

---

# 🗄️ Database

The application uses **SQLite** through SQLAlchemy.

Database:

```text
performance.db
```

Each test result stores information such as:

* API URL
* Number of requests
* Minimum latency
* Maximum latency
* Average latency
* P95 latency
* P99 latency
* Success rate
* Execution mode
* HTTP method
* Timestamp

---

# ☁️ Deployment

The project includes a `render.yaml` configuration for deployment on Render.

The configured service uses:

```text
Python 3.11
```

and starts the application using:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Deploying

1. Push the project to GitHub.
2. Create a new Web Service on Render.
3. Connect the GitHub repository.
4. Render can use the included `render.yaml` configuration.
5. Deploy the application.

---

# 🔐 Project Configuration

The project currently uses a local SQLite database:

```text
sqlite:///./performance.db
```

The `.gitignore` excludes the SQLite database, Python cache files, virtual environments, and environment files.

---

# 🎯 Use Cases

This project can be useful for:

* API performance testing
* Comparing sequential and concurrent requests
* Measuring API response latency
* Checking API reliability
* Learning asynchronous Python
* Understanding REST API development
* Practicing FastAPI
* Learning API testing concepts
* Demonstrating backend development skills

---

# 🧠 What I Learned

Through this project, I worked with:

* FastAPI
* REST API development
* Asynchronous programming
* HTTPX
* API performance testing
* Latency measurement
* Percentile calculations
* Pydantic validation
* SQLAlchemy ORM
* SQLite
* API request methods
* Database persistence
* Git & GitHub
* Cloud deployment

---

# 🔮 Future Improvements

Possible improvements include:

* 📈 Performance graphs and dashboards
* 📊 Advanced performance reports
* 📁 Export results to CSV/Excel
* 🔐 Authentication and authorization
* ⚙️ Configurable request timeout
* 📦 Support for custom HTTP headers
* 📈 Historical performance comparison
* 🚦 Performance threshold alerts
* 🧪 Automated test suites
* 🗃️ PostgreSQL support for production deployments
* 🌐 Frontend dashboard

---

# 👨‍💻 Author

**Ganesh**

GitHub: **[Ganesh10000-ai](https://github.com/Ganesh10000-ai)**

---

## ⭐ If you find this project useful

Consider giving the repository a ⭐ on GitHub!

from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class TestRequest(BaseModel):
    url: str
    num_requests: int
    mode: str = "concurrent"
    method: str = "GET"
    body: Optional[dict] = None

class TestResponse(BaseModel):
    api_url: str
    num_requests: int
    min_latency: float
    max_latency: float
    avg_latency: float
    p95_latency: float = 0.0
    p99_latency: float = 0.0
    success_rate: float
    latencies: List[float]
    mode: str = "concurrent"
    method: str = "GET"
    timestamp: datetime

    class Config:
        from_attributes = True
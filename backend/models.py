from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from database import Base

class TestResult(Base):
    __tablename__ = "test_results"

    id           = Column(Integer, primary_key=True, index=True)
    api_url      = Column(String,  nullable=False)
    num_requests = Column(Integer, nullable=False)
    min_latency  = Column(Float)
    max_latency  = Column(Float)
    avg_latency  = Column(Float)
    p95_latency  = Column(Float,  default=0.0)
    p99_latency  = Column(Float,  default=0.0)
    success_rate = Column(Float)
    mode         = Column(String, default="concurrent")
    method       = Column(String, default="GET")
    timestamp    = Column(DateTime, default=datetime.utcnow)
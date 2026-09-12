from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime

import models, schemas, database
from tester import run_performance_test
from database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Performance Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/test", response_model=schemas.TestResponse)
async def run_test(request: schemas.TestRequest, db: Session = Depends(database.get_db)):
    if request.num_requests < 1 or request.num_requests > 100:
        raise HTTPException(status_code=400, detail="num_requests must be between 1 and 100")
    if request.mode not in ("concurrent", "sequential"):
        raise HTTPException(status_code=400, detail="mode must be 'concurrent' or 'sequential'")
    if request.method not in ("GET", "POST", "PUT", "DELETE", "PATCH"):
        raise HTTPException(status_code=400, detail="Invalid HTTP method")

    body = None
    if request.body and request.method in ("POST", "PUT", "PATCH"):
        body = request.body

    result = await run_performance_test(
        request.url,
        request.num_requests,
        request.mode,
        request.method,
        body
    )

    db_result = models.TestResult(
        api_url      = request.url,
        num_requests = request.num_requests,
        min_latency  = result["min_latency"],
        max_latency  = result["max_latency"],
        avg_latency  = result["avg_latency"],
        p95_latency  = result["p95_latency"],
        p99_latency  = result["p99_latency"],
        success_rate = result["success_rate"],
        mode         = request.mode,
        method       = request.method,
        timestamp    = datetime.utcnow(),
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)

    return schemas.TestResponse(
        api_url      = db_result.api_url,
        num_requests = db_result.num_requests,
        min_latency  = db_result.min_latency,
        max_latency  = db_result.max_latency,
        avg_latency  = db_result.avg_latency,
        p95_latency  = db_result.p95_latency,
        p99_latency  = db_result.p99_latency,
        success_rate = db_result.success_rate,
        latencies    = result["latencies"],
        mode         = db_result.mode,
        method       = db_result.method,
        timestamp    = db_result.timestamp,
    )

@app.get("/history", response_model=list[schemas.TestResponse])
def get_history(db: Session = Depends(database.get_db)):
    results = db.query(models.TestResult).order_by(
        models.TestResult.timestamp.desc()
    ).limit(20).all()
    return [
        schemas.TestResponse(
            api_url      = r.api_url,
            num_requests = r.num_requests,
            min_latency  = r.min_latency,
            max_latency  = r.max_latency,
            avg_latency  = r.avg_latency,
            p95_latency  = r.p95_latency  or 0.0,
            p99_latency  = r.p99_latency  or 0.0,
            success_rate = r.success_rate,
            latencies    = [],
            mode         = r.mode   or "concurrent",
            method       = r.method or "GET",
            timestamp    = r.timestamp,
        ) for r in results
    ]
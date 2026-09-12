import httpx
import asyncio
import time
from typing import List, Tuple, Optional

async def run_single_request(
    client: httpx.AsyncClient,
    url: str,
    method: str = "GET",
    body: Optional[dict] = None
) -> Tuple[float, bool]:
    try:
        start = time.monotonic()
        response = await client.request(
            method, url,
            json=body if body else None,
            timeout=10.0
        )
        latency = (time.monotonic() - start) * 1000
        success = 200 <= response.status_code < 300
        return latency, success
    except Exception:
        return 0.0, False

def calculate_percentile(latencies: List[float], percentile: float) -> float:
    if not latencies:
        return 0.0
    sorted_latencies = sorted(latencies)
    index = min(int(percentile / 100 * len(sorted_latencies)), len(sorted_latencies) - 1)
    return sorted_latencies[index]

async def run_performance_test(
    url: str,
    num_requests: int,
    mode: str = "concurrent",
    method: str = "GET",
    body: Optional[dict] = None
):
    async with httpx.AsyncClient() as client:
        if mode == "concurrent":
            tasks = [
                run_single_request(client, url, method, body)
                for _ in range(num_requests)
            ]
            results = await asyncio.gather(*tasks)
        else:
            results = []
            for _ in range(num_requests):
                result = await run_single_request(client, url, method, body)
                results.append(result)

    successful_latencies = [r[0] for r in results if r[1]]
    successes = sum(1 for r in results if r[1])
    all_latencies = [r[0] for r in results]

    return {
        "latencies":    all_latencies,
        "min_latency":  min(successful_latencies)  if successful_latencies else 0,
        "max_latency":  max(successful_latencies)  if successful_latencies else 0,
        "avg_latency":  sum(successful_latencies) / len(successful_latencies) if successful_latencies else 0,
        "p95_latency":  calculate_percentile(successful_latencies, 95),
        "p99_latency":  calculate_percentile(successful_latencies, 99),
        "success_rate": (successes / num_requests) * 100,
    }
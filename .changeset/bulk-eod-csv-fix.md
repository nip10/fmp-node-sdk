---
"fmp-node-sdk": major
---

Fix `getBatchEODPrices` and `getBatchEODPricesRange` CSV response parsing

The `eod-bulk` FMP endpoint returns CSV, not JSON. Previously both methods always threw a JSON parse error. They now correctly parse the CSV response into typed `EODPrice[]` objects.

A new `getText()` method has been added to `FMPClient` for fetching raw text responses from endpoints that do not return JSON.

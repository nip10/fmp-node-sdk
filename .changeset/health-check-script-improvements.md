---
"fmp-node-sdk": patch
---

Improve endpoint health check script

- Classify HTTP 402 responses as `payment_required` instead of generic `error`, giving an accurate picture of subscription-gated endpoints
- Add distinct console icons per status (`💳` payment required, `🔍` not found)
- List not-found endpoints in the summary output
- Exit code no longer triggers on `payment_required` — only genuine unexpected errors cause a non-zero exit

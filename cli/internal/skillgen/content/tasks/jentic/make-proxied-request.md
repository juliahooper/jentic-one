---
name: make-proxied-request
description: Make a successful GET request to the test API through the Jentic broker.
version: 1
---

# Make Proxied Request

## When to Use

Use this skill when you need to perform the make proxied request step during onboarding to the Jentic platform.

## Prerequisites

- Access to the Jentic platform
- Completed: Verify Access Granted (`verify-access-granted`)

## Procedure

### 1. Make Proxied Request

Make a successful GET request to the test API through the Jentic broker.

**CLI:**

```bash
jentic execute
```

**HTTP:**

```
GET /get
```

**Notes:**
- Execute the API call through the Jentic broker, not directly
- The broker handles credential injection (API key attachment) automatically
- For CLI: `jentic execute` routes through the broker

## Quick Reference

### CLI Commands

- `jentic execute`

### HTTP Endpoints

- `GET /get`

## Pitfalls

- Don't call the test API directly — the verification checks for a broker execution record
- Ensure your toolkit binding is approved before attempting execution

## Verification

- Execution record exists
- Test API received the proxied request
- At least one execution completed successfully

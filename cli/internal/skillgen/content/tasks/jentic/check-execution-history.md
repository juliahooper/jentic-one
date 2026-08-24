---
name: check-execution-history
description: Query the execution records to verify your proxied request was logged.
version: 1
---

# Check Execution History

## When to Use

Use this skill when you need to perform the check execution history step during onboarding to the Jentic platform.

## Prerequisites

- Access to the Jentic platform
- Completed: Make Proxied Request (`make-proxied-request`)

## Procedure

### 1. Check Execution History

Query the execution records to verify your proxied request was logged.

**CLI:**

```bash
jentic executions
```

**HTTP:**

```
GET /executions
```

**Response:**
```json
{
  "data": "<array>"
  "has_more": "<boolean>"
  "next_cursor": "<string>"
}
```

**Query parameters:**
- `toolkit_id`
- `trace_id`
- `status`
- `from`
- `to`
- `api`
- `actor_id`
- `origin`
- `cursor`
- `limit`

**Notes:**
- Query your execution records to confirm the proxied request was logged
- Filter by actor_id and time range for precision

## Quick Reference

### CLI Commands

- `jentic executions`

### HTTP Endpoints

- `GET /executions`

## Pitfalls

- Execution records may take a moment to appear after the request completes

## Verification

- Execution records exist for this agent

---
name: view-audit-events
description: Browse the platform audit log for your agent's activity.
version: 1
---

# View Audit Events

## When to Use

Use this skill when you need to perform the view audit events step during onboarding to the Jentic platform.

## Prerequisites

- Access to the Jentic platform
- Completed: Check Execution History (`check-execution-history`)

## Procedure

### 1. View Audit Events

Browse the platform audit log for your agent's activity.

**CLI:**

```bash
jentic audit
```

**HTTP:**

```
GET /audit
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
- `target_type`
- `target_id`
- `actor_id`
- `origin`
- `since`
- `until`
- `cursor`
- `limit`

**Notes:**
- The audit log records all significant platform actions (registration, token issues, executions)
- Filter with `since` parameter to limit to current session

## Quick Reference

### CLI Commands

- `jentic audit`

### HTTP Endpoints

- `GET /audit`

## Pitfalls

- Audit events are eventually consistent — very recent actions may not appear immediately

## Verification

- Audit log contains events from this run

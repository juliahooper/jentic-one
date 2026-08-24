---
name: find-credential
description: Find the test API (jentic-test/test-api) in the platform's API registry and note its authentication requirements and endpoints.
version: 1
---

# Find Credential

## When to Use

Use this skill when you need to perform the find credential step during onboarding to the Jentic platform.

## Prerequisites

- Access to the Jentic platform
- Completed: Discover Apis (`discover-apis`)

## Procedure

### 1. Find Credential

Find the test API (jentic-test/test-api) in the platform's API registry and note its authentication requirements and endpoints.

**CLI:**

```bash
jentic apis
```

**HTTP:**

```
GET /apis
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
- `vendor`
- `cursor`
- `limit`

**Notes:**
- Look for `jentic-test/test-api` in the API list
- Note the API's version (1.0.0) — you'll need the full path for subsequent calls

## Quick Reference

### CLI Commands

- `jentic apis`

### HTTP Endpoints

- `GET /apis`

## Pitfalls

- The API details endpoint requires the full vendor/name/version path

## Verification

- Agent accessed test API details

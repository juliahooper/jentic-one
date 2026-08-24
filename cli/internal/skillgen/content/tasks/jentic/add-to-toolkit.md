---
name: add-to-toolkit
description: Request access to a toolkit containing the test API credential so you can make proxied requests through the broker.
version: 1
---

# Add To Toolkit

## When to Use

Use this skill when you need to perform the add to toolkit step during onboarding to the Jentic platform.

## Prerequisites

- Access to the Jentic platform
- Completed: Discover Oauth Metadata (`discover-oauth-metadata`)

## Procedure

### 1. Add To Toolkit

Request access to a toolkit containing the test API credential so you can make proxied requests through the broker.

**CLI:**

```bash
jentic access request
```

**HTTP:**

```
POST /access-requests
```

**Request body:**
```json
{
  "items": "<array>" // required
  "reason": "<string>"
}
```

**Response:**
```json
{
  "actor_id": "<string>"
  "approve_url": "<string>"
  "created_by": "<string>"
  "evaluation": "<string>"
  "expires_at": "<string>"
  "filed_at": "<string>"
  "filer_owner": "<string>"
  "filer_owner_id": "<string>"
  "id": "<string>"
  "items": "<array>"
  "reason": "<string>"
  "requested_by": "<string>"
  "status": "<string>"
}
```

**Notes:**
- File an access request specifying which toolkit you need binding to
- The request body needs `toolkit_id` — discover available toolkits first via GET /toolkits or the API registry
- Approval happens asynchronously (typically 5-10s in the QA environment)

## Quick Reference

### CLI Commands

- `jentic access request`

### HTTP Endpoints

- `POST /access-requests`

## Pitfalls

- You must specify a valid `toolkit_id` — the request will fail otherwise
- Don't proceed to proxied requests until the access request status is `approved`

## Verification

- Access request was filed
- Access request was approved

---
name: register-agent
description: Register a new agent identity on the platform.
version: 1
---

# Register Agent

## When to Use

Use this skill when you need to perform the register agent step during onboarding to the Jentic platform.

## Prerequisites

- Access to the Jentic platform

## Procedure

### 1. Register Agent

Register a new agent identity on the platform.

**CLI:**

```bash
jentic register
```

**HTTP:**

```
POST /register
```

**Request body:**
```json
{
  "client_name": "<string>" // required
  "grant_types": "<array>"
  "jwks": "<object>" // required
  "scope": "<string>"
  "token_endpoint_auth_method": "<string>"
}
```

**Response:**
```json
{
  "claim_token": "<string>"
  "client_id": "<string>"
  "grant_types": "<array>"
  "registration_access_token": "<string>"
  "registration_client_uri": "<string>"
  "status": "<string>"
  "token_endpoint_auth_method": "<string>"
}
```

**Notes:**
- Requires a JWK keypair — generate an ES256 key and include the public key in `jwks`
- Only `client_name` and `jwks` are required fields
- Registration requires admin approval — poll or wait 10-15s before attempting token exchange

## Quick Reference

### CLI Commands

- `jentic register`

### HTTP Endpoints

- `POST /register`

## Pitfalls

- Do NOT request specific scopes during registration — the platform assigns defaults on approval
- The agent starts in `pending` status until approved; token exchange will fail with 'invalid grant' until then

## Verification

- Agent registration recorded in audit log
- Agent is active and approved

---
name: authenticate
description: Exchange credentials for an access token (JWT bearer or CLI login).
version: 1
---

# Authenticate

## When to Use

Use this skill when you need to perform the authenticate step during onboarding to the Jentic platform.

## Prerequisites

- Access to the Jentic platform
- Completed: Register Agent (`register-agent`)

## Procedure

### 1. Authenticate

Exchange credentials for an access token (JWT bearer or CLI login).

**CLI:**

```bash
jentic profile
```

**HTTP:**

```
POST /oauth/token
```

**Request body:**
```json
{
  "assertion": "<string>"
  "client_id": "<string>"
  "client_secret": "<string>"
  "code": "<string>"
  "code_verifier": "<string>"
  "grant_type": "<string>" // required
  "redirect_uri": "<string>"
  "refresh_token": "<string>"
}
```

**Response:**
```json
{
  "access_token": "<string>"
  "expires_in": "<integer>"
  "id_token": "<string>"
  "refresh_token": "<string>"
  "token_type": "<string>"
}
```

**Notes:**
- Use grant_type `urn:ietf:params:oauth:grant-type:jwt-bearer`
- The `assertion` field must be a signed JWT with `aud` set to the token endpoint URL (not the base URL)
- Sign the JWT with the same private key whose public JWK was submitted during registration
- Fetch `/.well-known/oauth-authorization-server` first to discover the correct `token_endpoint` URL

## Quick Reference

### CLI Commands

- `jentic profile`

### HTTP Endpoints

- `POST /oauth/token`

## Pitfalls

- Audience (`aud`) must be the token_endpoint URL, not the base URL — the server validates this
- If you get 'invalid grant', the agent may still be pending approval — wait and retry
- The JWT must include `sub` = your client_id from registration

## Verification

- Token issuance recorded in audit log

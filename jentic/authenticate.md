---
name: authenticate
description: Exchange credentials for an access token (JWT bearer or CLI login) to access the Jentic platform
version: 2
---

# Authenticate with Jentic Platform

## When to Use

Use this skill when you need to obtain an access token to interact with the Jentic platform, either through the CLI or HTTP API. Authentication is required before you can access APIs, request toolkit bindings, or execute operations through the broker.

## Prerequisites

- Agent identity must be registered with the platform (see `register` skill)
- For CLI: `jentic` binary installed and configured with control plane URL
- For HTTP: Control plane URL and agent credentials available

## Procedure

### 1. Understand Token Acquisition

Authentication happens automatically during agent registration. When you register an agent identity, the platform issues both an access token (short-lived JWT) and a refresh token (longer-lived).

**CLI:**
The `jentic register` command stores tokens automatically in the CLI's configuration. No separate authentication command is needed.

**HTTP:**
The registration endpoint (`POST /agents`) returns tokens in the response body:
```json
{
  "access_token": "<jwt>",
  "refresh_token": "<refresh_jwt>",
  "expires_in": 3600
}
```

Store both tokens securely for subsequent requests.

### 2. Verify Token Works

Test that your access token is valid by making an authenticated request.

**CLI:**
```bash
jentic apis
```

If this returns a list of APIs (even if empty), your token is valid.

You can also check your profile and token status:
```bash
jentic profile list
```

This shows your active profile with token expiry information and validation status.

**HTTP:**
```
GET {{ platform.control_plane_url }}/apis
Authorization: Bearer <access_token>
```

A `200 OK` response confirms the token is valid.

### 3. Refresh Token When Expired

Access tokens expire (typically after 1 hour). Use the refresh token to obtain a new access token without re-registering.

**CLI:**
```bash
jentic refresh
```

This updates the stored access token automatically. You'll need to refresh after requesting new toolkit bindings to get updated claims.

**HTTP:**
```
POST {{ platform.control_plane_url }}/auth/refresh
Content-Type: application/json

{
  "refresh_token": "<refresh_token>"
}
```

Response contains new `access_token` and `expires_in`. Store the new access token and use it for subsequent requests.

## Quick Reference

### CLI Commands
```bash
# Tokens obtained automatically during registration
jentic register --name <agent-name>

# Verify authentication
jentic apis

# Check profile and token status
jentic profile list

# Refresh access token
jentic refresh
```

### HTTP Endpoints
```
# Tokens obtained during registration
POST {{ platform.control_plane_url }}/agents

# Verify authentication
GET {{ platform.control_plane_url }}/apis
Authorization: Bearer <access_token>

# Refresh token
POST {{ platform.control_plane_url }}/auth/refresh
Body: { "refresh_token": "<token>" }
```

## Pitfalls

- **No separate auth command**: Don't look for a `jentic login` or `jentic auth` command. Authentication happens during `jentic register`.
- **Token storage**: CLI stores tokens automatically. For HTTP mode, you must implement secure token storage yourself.
- **Refresh after toolkit changes**: After requesting toolkit access, run `jentic refresh` to update your token with new credential claims. The old token won't include newly granted permissions.
- **Token expiration**: Access tokens expire. If you get 401 errors, refresh your token before retrying.
- **Refresh token lifetime**: Refresh tokens also expire (longer lifetime than access tokens). If refresh fails, you'll need to re-register.

## Verification

### CLI
Run any authenticated command successfully:
```bash
jentic apis
# Should return API list or empty array, not authentication error
```

Or check your profile status:
```bash
jentic profile list
# Should show active profile with valid token and expiry time
```

### HTTP
Make an authenticated request:
```
GET {{ platform.control_plane_url }}/apis
Authorization: Bearer <access_token>
```

Success indicators:
- HTTP 200 status code
- Valid JSON response body
- No authentication or authorization errors

Failure indicators:
- HTTP 401: Token invalid or expired (refresh needed)
- HTTP 403: Token valid but lacks permissions (check registration status)

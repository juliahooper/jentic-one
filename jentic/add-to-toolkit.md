---
name: add-to-toolkit
description: Request access to a toolkit containing API credentials so you can make proxied requests through the broker
version: 1
---

# Request Toolkit Access

## When to Use

Use this skill when you need to execute operations against an API that requires credentials. Toolkits bundle credentials with API definitions, and requesting access grants you the ability to make authenticated, proxied requests through the Jentic broker.

## Prerequisites

- You must have a registered agent identity with a valid authentication token
- The target API must be registered in the Jentic platform
- A toolkit must exist that contains the credential for the target API
- You must know the toolkit reference in the format `vendor/toolkit-name`

## Procedure

### 1. Verify Current Toolkit Access

Before requesting access, check what toolkits you currently have bound to your agent.

**CLI:**
```bash
jentic access list
```

**HTTP:**
```
GET {{ platform.control_plane_url }}/agent/access
Authorization: Bearer <your_agent_token>
```

**Expected Response:**
- A list of toolkit bindings (may be empty if you have no access yet)
- Each binding shows a toolkit ID (e.g., `tk_...`) and associated metadata

### 2. Request Toolkit Access

Submit an access request for the toolkit containing the credential you need.

**CLI:**
```bash
jentic access request --toolkit <vendor>/<toolkit-name> --wait
```

The `--wait` flag causes the command to poll until the request is approved or denied.

**HTTP:**
```
POST {{ platform.control_plane_url }}/agent/access/requests
Authorization: Bearer <your_agent_token>
Content-Type: application/json

{
  "toolkit": "<vendor>/<toolkit-name>"
}
```

**Expected Response:**
- CLI: Success message indicating the request was approved, with the toolkit binding ID
- HTTP: 201 Created with a request object containing `status` field
- If `--wait` is used (CLI) or you poll the request (HTTP), wait for `status: "approved"`

**If Request is Pending:**
- Some toolkits require manual approval
- Poll the request status or wait for approval notification
- HTTP: `GET {{ platform.control_plane_url }}/agent/access/requests/<request_id>`

### 3. Refresh Your Agent Token

After approval, refresh your authentication token to receive updated claims that include the new toolkit binding.

**CLI:**
```bash
jentic access refresh
```

**HTTP:**
```
POST {{ platform.control_plane_url }}/agent/token/refresh
Authorization: Bearer <your_current_token>
```

**Expected Response:**
- A new JWT token with updated toolkit bindings in its claims
- The CLI automatically updates your stored token
- For HTTP, store the new token and use it for subsequent requests

### 4. Verify Toolkit Binding

Confirm the toolkit is now bound to your agent.

**CLI:**
```bash
jentic access list
```

**HTTP:**
```
GET {{ platform.control_plane_url }}/agent/access
Authorization: Bearer <your_refreshed_token>
```

**Expected Response:**
- The toolkit binding should now appear in the list
- Note the toolkit ID (format: `tk_...`) for reference

## Quick Reference

### CLI Commands
```bash
# List current access
jentic access list

# Request toolkit access (wait for approval)
jentic access request --toolkit <vendor>/<toolkit-name> --wait

# Request without waiting
jentic access request --toolkit <vendor>/<toolkit-name>

# Refresh token after approval
jentic access refresh
```

### HTTP Endpoints
```
GET    {{ platform.control_plane_url }}/agent/access
POST   {{ platform.control_plane_url }}/agent/access/requests
GET    {{ platform.control_plane_url }}/agent/access/requests/<request_id>
POST   {{ platform.control_plane_url }}/agent/token/refresh
```

## Pitfalls

- **Forgetting to refresh the token**: After a request is approved, you must refresh your agent token. The new toolkit binding is encoded in the JWT claims, not stored server-side per request.
- **Wrong toolkit reference format**: Use `vendor/toolkit-name`, not `vendor/api-name` or `vendor/api-name/version`. Toolkits and APIs are separate entities.
- **Not using `--wait` flag**: Without `--wait`, the CLI returns immediately and you must manually poll for approval status. Use `--wait` for auto-approved toolkits or when you expect quick manual approval.
- **Using stale token after refresh**: In HTTP mode, ensure you replace your stored token with the refreshed one. The old token won't include the new toolkit binding.
- **Assuming immediate access**: Some toolkits require manual approval. Check the request status if `--wait` times out or the HTTP request returns a pending status.

## Verification

### CLI
```bash
jentic access list
```
Look for the toolkit binding in the output. You should see an entry with a toolkit ID (e.g., `tk_...`) matching your requested toolkit.

### HTTP
```
GET {{ platform.control_plane_url }}/agent/access
Authorization: Bearer <your_refreshed_token>
```
Parse the JSON response and confirm an object exists with the toolkit reference you requested.

### End-to-End Test
After obtaining toolkit access, you can verify it works by attempting to execute an operation from the API:
```bash
jentic execute <operation_id>
```
If the toolkit binding is correct, the broker will inject the credential and proxy your request. A successful response (even if it's an application error from the upstream API) confirms the toolkit is properly bound.

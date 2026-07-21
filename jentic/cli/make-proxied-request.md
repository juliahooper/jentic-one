```markdown
---
name: make-proxied-request
description: Execute an API operation through the Jentic broker after discovering the API and obtaining access credentials
version: 3
---

# Making Proxied API Requests Through Jentic

## When to Use

When you need to call an external API through Jentic's broker service, which handles authentication and request proxying on your behalf.

## Prerequisites

- Active Jentic agent identity (registered and approved)
- Knowledge of which API you need to call
- Toolkit binding approved for the target API
- Valid access token (refreshed after toolkit binding approval)

## Procedure

1. **Discover the target API in the registry**
   
   List available APIs to find your target:
   ```bash
   jentic apis list
   ```
   
   Look for the API by vendor/name in the output table.

2. **List operations for the API**
   
   Use the full API reference (vendor/name/version):
   ```bash
   jentic apis operations <vendor>/<name>/<version>
   ```
   
   Expected output: Table showing operation_id, method, path, and summary for each endpoint.
   Note the `operation_id` (e.g., `op_6a58da5c629c0e3b921f48c9`) for the operation you need.

3. **Verify you have toolkit access**
   
   Check your current bindings:
   ```bash
   jentic access list
   ```
   
   If the API is not listed, request access using vendor/name format (not vendor/name/version):
   ```bash
   jentic access request --toolkit <vendor>/<name> --wait
   ```
   
   The `--wait` flag will block until approval is granted.

4. **Refresh your access token**
   
   After receiving a new toolkit binding, refresh to get updated permissions:
   ```bash
   jentic access refresh
   ```
   
   Expected output: Confirmation that token was refreshed successfully.

5. **Execute the operation through the broker**
   
   Use the operation_id from step 2:
   ```bash
   jentic execute <operation_id>
   ```
   
   Alternative: You can also use METHOD:URL format:
   ```bash
   jentic execute 'GET https://api.example.com/v1/endpoint'
   ```
   
   Expected output: The proxied response from the upstream API, with the broker handling authentication automatically.

## Quick Reference

- `jentic apis list` - Browse available APIs
- `jentic apis operations <vendor>/<name>/<version>` - List operations and get operation_ids
- `jentic access list` - Check current toolkit bindings
- `jentic access request --toolkit <vendor>/<name> --wait` - Request and wait for access (use vendor/name, not vendor/name/version)
- `jentic access refresh` - Refresh token after new bindings
- `jentic execute <operation_id>` - Execute operation through broker (or use 'METHOD URL' format)

## Pitfalls

- **Don't skip token refresh**: After receiving a new toolkit binding, you must run `jentic access refresh` before the broker will recognize your new permissions
- **Use operation_id, not METHOD/path**: The `execute` command requires the registry operation_id (from `apis operations`), not a "GET /path" format. Alternatively, use the full 'METHOD URL' format with the complete upstream URL
- **Full API reference required for operations**: The `apis operations` command needs the complete vendor/name/version format, not just vendor/name
- **Toolkit access uses vendor/name only**: When requesting access with `jentic access request --toolkit`, use vendor/name format (e.g., `jentic-test/test-api`), not vendor/name/version. The version is not included in toolkit references
- **Localhost upstreams may be blocked**: The broker may reject requests to localhost/127.0.0.1 upstream URLs as a security policy (SSRF prevention)
- **Auth requirements not visible in CLI**: The `apis inspect` command does not show authentication requirements (outputs `"auth":null`); assume APIs require credentials unless documented otherwise. Authentication is handled transparently by the broker after toolkit binding approval
- **Inspect command format**: `jentic inspect` accepts an operation_id, or 'METHOD URL' format (e.g., `jentic inspect 'GET https://api.example.com/v1/things'`), not METHOD:url without quotes or METHOD /path
- **OpenAPI spec retrieval may fail**: The CLI may return HTTP 500 errors when attempting to retrieve OpenAPI specifications for some API revisions. Use `apis operations` to list endpoints instead
- **Command name is "apis" not "api"**: The correct command is `jentic apis`, not `jentic api`

## Verification

A successful proxied request returns:
- HTTP 200 status (or appropriate success code for the operation)
- Response body from the upstream API
- No authentication errors (401/403), indicating the broker successfully applied credentials

If you receive a 400 error about "blocked address range", the upstream URL is restricted by broker policy (not a workflow issue).
```

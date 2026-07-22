---
name: make-proxied-request
description: Make authenticated API requests through the Jentic broker using toolkit credentials
version: 1
---

# Making Proxied API Requests Through Jentic

## When to Use

Use this skill when you need to call an external API through Jentic's broker, which handles authentication, credential injection, and request proxying on your behalf.

## Prerequisites

- Agent identity registered and authenticated with Jentic platform
- Target API registered in the Jentic registry
- Toolkit access granted containing credentials for the target API
- Valid authentication token with toolkit binding
- Target API must be accessible from the broker (not localhost/private IP ranges in production environments)

## Procedure

### 1. Locate the Target API in the Registry

First, verify the API exists and get its identifier.

**CLI:**
```bash
jentic apis list
```

Look for your target API in the output. Note the vendor/name/version format (e.g., `vendor-name/api-name/1.0.0`).

**HTTP:**
```
GET {{ platform.control_plane_url }}/apis
Authorization: Bearer <your_token>
```

Response will include an array of API objects with `vendor`, `name`, and `version` fields.

**Expected outcome:** You should see your target API listed with its full identifier.

### 2. Request Toolkit Access

If you don't already have access to a toolkit containing the API's credentials, request it.

**CLI:**
```bash
jentic access request <toolkit-name>
```

The system will return immediately with approval status. Auto-approval is common for test environments.

**HTTP:**
```
POST {{ platform.control_plane_url }}/access-requests
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "toolkit": "<toolkit-name>"
}
```

**Expected outcome:** Response indicates `approved: true` or similar approval status.

### 3. Refresh Your Authentication Token

After gaining new toolkit access, refresh your token to include the new binding.

**CLI:**
```bash
jentic auth refresh
```

This updates your local token with the new permissions.

**HTTP:**
```
POST {{ platform.control_plane_url }}/auth/refresh
Authorization: Bearer <your_current_token>
```

Response includes a new token with updated `toolkit_bindings`.

**Expected outcome:** Your token now includes the toolkit in its bindings. Verify with `jentic auth status` (CLI) or by decoding the JWT.

### 4. Find the Operation ID

To execute a request, you need the operation's unique identifier from the registry.

**CLI:**
```bash
jentic apis operations <vendor>/<api-name>/<version> --json
```

The `--json` flag is important because the formatted output doesn't display operation IDs. Look for the `operation_id` field (format: `op_<hash>`).

**HTTP:**
```
GET {{ platform.control_plane_url }}/apis/<vendor>/<api-name>/<version>/operations
Authorization: Bearer <your_token>
```

Parse the JSON response to find the operation matching your desired HTTP method and path.

**Expected outcome:** You have an operation ID like `op_6a58da5c629c0e3b921f48c9`.

### 5. Execute the Proxied Request

Use the operation ID to make the request through the broker.

**CLI:**
```bash
jentic execute <operation_id>
```

For requests with parameters, query strings, or body:
```bash
jentic execute <operation_id> --param key=value --header "X-Custom: value"
```

**HTTP:**
```
POST {{ platform.broker_url }}/execute/<operation_id>
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "parameters": {},
  "headers": {},
  "body": {}
}
```

**Expected outcome:** The broker proxies your request to the upstream API, injects credentials from your toolkit, and returns the API's response.

### 6. Verify the Response

Check that you received a successful response from the upstream API (not an error from the broker).

**CLI:**
The command output will show the HTTP status and response body from the upstream API.

**HTTP:**
The response status and body reflect the upstream API's response. Broker errors (4xx) will have a JSON body with an `error` field describing broker-level issues.

**Expected outcome:** A 2xx status code and response body from the target API indicates success.

## Quick Reference

### CLI Commands
```bash
jentic apis list                                    # List available APIs
jentic access request <toolkit>                     # Request toolkit access
jentic auth refresh                                 # Refresh token with new bindings
jentic auth status                                  # Check current bindings
jentic apis operations <api> --json                 # List operations with IDs
jentic execute <operation_id>                       # Execute proxied request
jentic execute <operation_id> --param key=value     # Execute with parameters
```

### HTTP Endpoints
```
GET  /apis                                          # List APIs
POST /access-requests                               # Request toolkit access
POST /auth/refresh                                  # Refresh authentication token
GET  /apis/<vendor>/<name>/<version>/operations     # List operations
POST /execute/<operation_id>                        # Execute proxied request
```

## Pitfalls

- **Operation ID not visible**: The formatted output of `jentic apis operations` doesn't show operation IDs. Always use `--json` flag to see the `operation_id` field needed for execution.

- **Stale token after access grant**: After requesting and receiving toolkit access, you must refresh your authentication token. The new binding won't be active until you do.

- **SSRF protection blocks localhost**: The broker blocks requests to localhost, 127.0.0.1, and private IP ranges for security. Test APIs must be hosted on publicly routable addresses or the broker must be configured to allow the target range.

- **Wrong API identifier format**: API references must be in `vendor/name/version` format. Partial identifiers or other formats will fail.

- **Search command limitations**: The `jentic search` command may not return results reliably. Use `jentic apis list` and `jentic apis operations` for discovery instead.

- **Confusing operation reference formats**: The `execute` command requires the registry operation ID (e.g., `op_<hash>`), not the API path, HTTP method, or spec operationId. Always get this from `jentic apis operations --json`.

## Verification

**CLI:**
```bash
# Verify toolkit binding
jentic auth status
# Should show your toolkit in the bindings list

# Verify successful execution
jentic execute <operation_id>
# Should return 2xx status with upstream API response body
```

**HTTP:**
```
# Verify toolkit binding
GET {{ platform.control_plane_url }}/auth/status
# Response includes toolkit_bindings array

# Verify successful execution
POST {{ platform.broker_url }}/execute/<operation_id>
# Response status 200-299 with upstream API data (not broker error JSON)
```

Success means: (1) your token includes the toolkit binding, (2) the execute command/endpoint returns a response, (3) the response is from the upstream API (not a broker error), and (4) the status indicates success per the API's contract.

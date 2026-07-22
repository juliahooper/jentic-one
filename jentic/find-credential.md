---
name: find-credential
description: Locate an API in the platform registry and identify its authentication requirements and available endpoints
version: 1
---

# Finding API Credentials and Endpoints

## When to Use

Use this skill when you need to discover what authentication method a registered API requires and what operations are available, before requesting access or making calls through the broker.

## Prerequisites

- Valid agent identity registered with the platform
- Active authentication token
- Knowledge of the API's vendor/name/version identifier (format: `vendor/name/version`)

## Procedure

### 1. List Available APIs

Start by listing all APIs in the registry to confirm the target API exists and get its exact identifier.

**CLI:**
```bash
jentic apis
```

**HTTP:**
```
GET {{ platform.control_plane_url }}/apis
Authorization: Bearer <token>
```

Expected response includes an array of API objects with `vendor`, `name`, `version`, and `id` fields. Note the exact version string for the target API.

### 2. List Operations for the Target API

Once you have the full API identifier, list its operations to see available endpoints.

**CLI:**
```bash
jentic apis operations <vendor>/<name>/<version>
```

**HTTP:**
```
GET {{ platform.control_plane_url }}/apis/operations?api=<vendor>/<name>/<version>
Authorization: Bearer <token>
```

Expected response includes operation objects with:
- `id`: The operation identifier (format: `op_<hash>`) needed for execution
- `method`: HTTP method (GET, POST, etc.)
- `path`: The endpoint path
- `_links`: Related resource links

**Important:** Save the operation `id` values - these are required for executing operations later. The formatted CLI output may not display IDs prominently; use `--output json` to see full details.

### 3. Attempt to Retrieve the OpenAPI Specification

Try to get the full OpenAPI spec to understand authentication requirements and request/response schemas.

**CLI:**
```bash
jentic apis spec <vendor>/<name>/<version>
```

**HTTP:**
```
GET {{ platform.control_plane_url }}/apis/<vendor>/<name>/<version>/spec
Authorization: Bearer <token>
```

**Note:** This may fail with HTTP 500 if the spec file wasn't stored during API registration. If this occurs, proceed to alternative discovery methods.

### 4. Inspect Individual Operations (Alternative Discovery)

If the spec retrieval fails, try inspecting individual operations using their operation ID.

**CLI:**
```bash
jentic inspect <operation-id>
```

**HTTP:**
```
GET {{ platform.control_plane_url }}/operations/<operation-id>
Authorization: Bearer <token>
```

**Note:** The `jentic inspect` command accepts:
- Registry operation ID (from step 2)
- "METHOD URL" pair (e.g., `jentic inspect 'GET https://api.example.com/v1/resource'`)
- Spec operationId (if available from catalog)

However, operation lookup by path patterns may fail. Use the operation ID from step 2 for reliable results.

### 5. Check Catalog for Published Information

If direct API inspection is limited, check if the API is published in the public catalog with documentation.

**CLI:**
```bash
jentic catalog
```

**HTTP:**
```
GET {{ platform.control_plane_url }}/catalog
Authorization: Bearer <token>
```

This shows APIs that have been explicitly published with descriptions and may include authentication guidance.

### 6. Verify Current Toolkit Access

Check whether you already have access to a toolkit containing credentials for this API.

**CLI:**
```bash
jentic toolkits
```

**HTTP:**
```
GET {{ platform.control_plane_url }}/toolkits
Authorization: Bearer <token>
```

If the response is empty or doesn't include the target API, you'll need to request access (covered in separate skill documentation).

## Quick Reference

### CLI Commands
```bash
# List all APIs
jentic apis

# List operations for specific API
jentic apis operations <vendor>/<name>/<version>

# Get OpenAPI spec (may fail)
jentic apis spec <vendor>/<name>/<version>

# Inspect operation by ID
jentic inspect <operation-id>

# Check catalog
jentic catalog

# Check toolkit access
jentic toolkits
```

### HTTP Endpoints
```
GET /apis                                    # List APIs
GET /apis/operations?api=<vendor/name/ver>   # List operations
GET /apis/<vendor>/<name>/<version>/spec     # Get spec
GET /operations/<operation-id>               # Inspect operation
GET /catalog                                 # Public catalog
GET /toolkits                                # Current access
```

All HTTP requests require `Authorization: Bearer <token>` header.

## Pitfalls

- **Don't use partial API identifiers**: Commands like `jentic apis <vendor>/<name>` without version will fail. Always use the full `vendor/name/version` format.
- **Search functionality may be unreliable**: The `jentic search` command may return empty results even for valid queries. Prefer direct listing commands.
- **Operation IDs are hidden in formatted output**: Use `--output json` with CLI commands to see the full operation object including the `id` field needed for execution.
- **Spec retrieval may fail**: If `jentic apis spec` returns HTTP 500, the API was registered without storing its OpenAPI specification. Fall back to operation listing and inspection.
- **Path-based operation lookup is fragile**: `jentic inspect 'GET /path'` may fail to find operations. Always use the operation ID from `jentic apis operations`.
- **Authentication requirements may not be discoverable**: If spec retrieval fails and operations don't expose security schemes, you may need to consult external documentation or the API provider.

## Verification

You have successfully completed this task when you can answer:

1. **Does the API exist?** Confirmed by seeing it in `jentic apis` output
2. **What operations are available?** Listed via `jentic apis operations` with method and path for each
3. **What are the operation IDs?** Retrieved from JSON output of operations list
4. **What authentication does it require?** Determined from spec (if available) or external documentation

**CLI verification:**
```bash
jentic apis operations <vendor>/<name>/<version> --output json
```
Should return JSON array with at least one operation object containing `id`, `method`, and `path`.

**HTTP verification:**
```
GET {{ platform.control_plane_url }}/apis/operations?api=<vendor>/<name>/<version>
```
Should return 200 status with operation array in response body.

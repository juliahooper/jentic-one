---
name: read-api-spec
description: Download and examine an API's OpenAPI specification from the Jentic platform
version: 1
---

# Reading API Specifications

## When to Use

When you need to understand the full contract of an API including all operations, schemas, and parameters before integrating with it.

## Prerequisites

- Agent must be registered and authenticated with the platform
- Target API must be in your local registry (use `jentic apis` to verify)
- You need the full API reference in format: `vendor/name/version`

## Procedure

1. **List your local APIs to confirm the target exists**
   ```bash
   jentic apis
   ```
   Expected output: Table showing vendor, name, version, and status. Verify your target API is listed.

2. **Attempt to download the OpenAPI specification**
   ```bash
   jentic apis spec <vendor>/<name>/<version>
   ```
   Expected: The full OpenAPI spec document in YAML or JSON format.
   
   **Known Issue**: If you receive an HTTP 500 error about missing spec file, proceed to the workaround below.

3. **Workaround: Inspect operations individually**
   
   a. List all operations for the API in JSON format:
   ```bash
   jentic apis operations <vendor>/<name>/<version> --json
   ```
   
   b. Extract the `operation_id` from the JSON output (look for the `id` field in each operation object).
   
   c. Inspect each operation:
   ```bash
   jentic inspect <operation_id>
   ```
   Or for markdown format:
   ```bash
   jentic inspect <operation_id> --format markdown
   ```

4. **Review operation details**
   
   The inspect output provides:
   - HTTP method and URL path
   - Server base URL
   - API metadata (vendor, name, version)
   - Operation-specific parameters and schemas (when available)

## Quick Reference

- `jentic apis` - List APIs in local registry
- `jentic apis spec <vendor>/<name>/<version>` - Download full OpenAPI spec
- `jentic apis operations <vendor>/<name>/<version> --json` - List operations with IDs
- `jentic inspect <operation_id>` - View single operation details
- `jentic inspect 'METHOD URL'` - Inspect by HTTP method and URL (alternative syntax)

## Pitfalls

- **Incorrect API reference format**: Must use `vendor/name/version` with all three parts separated by slashes. Using only `vendor/name` will fail with "expected vendor/name/version" error.

- **Missing spec files**: The platform may have APIs registered without stored OpenAPI spec files (backend issue). If `apis spec` returns HTTP 500, use the `inspect` workaround to examine operations individually.

- **Finding operation IDs**: The operation ID is not visible in default table output. Always use `--json` flag with `apis operations` to see the `id` field needed for inspection.

- **Search limitations**: The `jentic search` command may not return expected results for known APIs. Rely on `jentic apis` to list your local registry instead.

## Verification

Success is confirmed when you can either:
- View the complete OpenAPI specification document (preferred), OR
- Successfully inspect at least one operation showing method, URL, and API metadata (workaround)

The operation details should clearly identify the API vendor, name, and version matching your target.

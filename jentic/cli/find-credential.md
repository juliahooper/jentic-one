---
name: find-credential
description: Locate an API in the platform registry and identify its authentication requirements and available endpoints
version: 1
---

# Finding API Credentials and Endpoints in the Registry

## When to Use

When you need to discover what APIs are available in the Jentic platform, understand their authentication requirements, and identify their available operations before requesting access.

## Prerequisites

- Active agent profile (registered and approved via `jentic register`)
- Access to the Jentic CLI
- Knowledge of the API vendor and name you're searching for

## Procedure

1. **List available APIs in the registry**
   
   Use the `jentic apis list` command to browse the registry. You can filter by vendor:
   
   ```bash
   jentic apis list --vendor <vendor-name>
   ```
   
   Expected output shows APIs with their vendor/name/version format (e.g., `jentic-test/test-api/1.0.0`).

2. **List operations for a specific API**
   
   Once you have the full API reference (vendor/name/version), list its available operations:
   
   ```bash
   jentic apis operations <vendor>/<name>/<version>
   ```
   
   Expected output shows operation IDs (e.g., `op_6a58da5c629c0e3b921f48c9`) with their HTTP method and path.

3. **Inspect individual operations**
   
   Use the operation ID from the previous step to get detailed information:
   
   ```bash
   jentic apis inspect <operation_id>
   ```
   
   This shows the operation's method, path, parameters, and other metadata.

4. **Check authentication requirements**
   
   **Known limitation**: Authentication requirements may not be visible in the CLI output. The `auth` field in operation inspection may show `null` even when authentication is required. 
   
   You can attempt to download the OpenAPI spec for more details:
   
   ```bash
   jentic apis spec <vendor>/<name>/<version>
   ```
   
   However, this may fail with a 500 error if the spec is not stored. Authentication requirements may only become clear when you request access or attempt to execute operations.

## Quick Reference

- `jentic apis list --vendor <vendor>` - Browse registry by vendor
- `jentic apis operations <vendor>/<name>/<version>` - List API operations
- `jentic apis inspect <operation_id>` - View operation details
- `jentic apis spec <vendor>/<name>/<version>` - Download OpenAPI spec (may not be available)

## Pitfalls

- **Wrong API reference format**: Commands require the full `vendor/name/version` format, not just `vendor/name`
- **Operation inspection requires operation ID**: You cannot use `METHOD /path` format directly; you must first get the operation ID from `jentic apis operations`
- **Auth requirements not visible**: The CLI may not expose authentication requirements clearly. Don't assume `auth: null` means no authentication is needed
- **Spec download may fail**: The OpenAPI spec endpoint may return 500 errors if the spec file is not stored in the platform

## Verification

You have successfully completed this task when you can answer:
- What is the full API reference (vendor/name/version)?
- What operations (HTTP method + path) are available?
- What are the operation IDs for each endpoint?

Note: You may not be able to fully determine authentication requirements from the CLI alone. This information may only become available after requesting toolkit access.

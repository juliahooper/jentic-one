```markdown
---
name: discover-apis
description: Browse the API catalog to list all available APIs and their versions
version: 3
---

# Discovering Available APIs

## When to Use

Use this skill when you need to explore what APIs are available in the Jentic platform before requesting access or making API calls.

## Prerequisites

- Jentic CLI installed and available in PATH
- Valid agent registration with active authentication token
- Active profile configured (verify with `jentic whoami`)

## Procedure

1. **List available APIs**
   
   You can browse APIs in two locations:
   
   **Local registry** (APIs you have access to):
   ```bash
   jentic apis list
   ```
   
   **Public catalog** (all available APIs):
   ```bash
   jentic catalog list
   ```
   
   Expected output format:
   ```
   VENDOR/NAME/VERSION
   vendor-name/api-name/1.0.0
   ```
   
   The output shows APIs in the format `vendor/name/version`. All three components are required for subsequent operations. The first component (before the first `/`) is the vendor name.

2. **View operations for a specific API**
   
   Use the `apis operations` command with the full three-part reference:
   
   ```bash
   jentic apis operations vendor/name/version
   ```
   
   Expected output includes:
   - Operation IDs (e.g., `op_6a58da5c629c0e3b921f48c9`)
   - HTTP methods and paths for each operation
   - Operation summaries describing functionality

3. **Inspect specific operations**
   
   To view detailed information about a specific operation, use the `apis inspect` command. You have three options:
   
   ```bash
   # Option 1: Using operation ID (from `jentic apis operations vendor/name/version`)
   jentic apis inspect <operation-id>
   
   # Option 2: Using METHOD and URL (note: must be quoted as a single argument)
   jentic apis inspect 'GET https://api.example.com/v1/resource'
   
   # Option 3: Using spec operationId
   jentic apis inspect <spec-operation-id>
   ```
   
   For markdown-formatted output (more readable):
   ```bash
   jentic apis inspect <operation-id> --format markdown
   ```

4. **View API metadata (alternative)**
   
   For API-level metadata without operations:
   
   ```bash
   jentic apis show vendor/name/version
   ```
   
   Note: Use `apis operations` instead if you need to see the list of operations with their IDs.

## Quick Reference

- `jentic apis list` - List APIs in your local registry
- `jentic catalog list` - List all APIs in the public catalog
- `jentic apis operations vendor/name/version` - List operations with their IDs
- `jentic apis inspect <operation-id>` - View detailed operation information
- `jentic apis inspect 'METHOD URL'` - Inspect operation by HTTP method and URL
- `jentic apis show vendor/name/version` - Show API metadata

## Pitfalls

- **Command naming**: The command is `jentic apis list` (not `jentic apis` or `jentic api list`). Use `jentic catalog list` to browse the public catalog.

- **API reference format**: Always use the full three-part format `vendor/name/version`. Partial references like `vendor/name` will fail with an error about expecting the version component. The first part (before the first `/`) is the vendor name.

- **Getting operations**: Use `jentic apis operations vendor/name/version` to list operations with their IDs. The `apis show` command provides metadata but may not include operation details.

- **Inspect command syntax**: 
  - The command is `jentic apis inspect`, not `jentic inspect`
  - When using METHOD and URL format, the entire string must be quoted as a single argument: `jentic apis inspect 'GET https://...'`
  - When using operation ID, pass the ID from `apis operations` output (e.g., `op_6a58da5c629c0e3b921f48c9`)
  - Do not use the format `vendor/name/version:method-path` - this will fail with "operation not found"

- **Missing spec files**: Some APIs may return HTTP 500 errors when attempting to retrieve OpenAPI specifications. This indicates the spec file is not stored in the platform. Basic API information (operations, paths, methods) is still available through `apis operations`.

- **Search limitations**: The `search` command may return empty results even when APIs exist. If search doesn't find what you need, try browsing with `jentic apis list` or `jentic catalog list` instead.

## Verification

Successful discovery is confirmed when:
- `jentic apis list` or `jentic catalog list` returns a list of one or more APIs without errors
- `jentic apis operations vendor/name/version` displays operations with their IDs
- You can identify the HTTP method and path for operations you want to use
- `jentic apis inspect` successfully retrieves detailed operation information using an operation ID
```

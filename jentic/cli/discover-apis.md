---
name: discover-apis
description: Browse the API catalog to list all available APIs and their versions
version: 2
---

# Discovering Available APIs

## When to Use

Use this skill when you need to explore what APIs are available in the Jentic platform before requesting access or making API calls.

## Prerequisites

- Jentic CLI installed and available in PATH
- Valid agent registration with active authentication token
- Active profile configured (verify with `jentic whoami`)

## Procedure

1. **List all available APIs**
   
   Use the `apis` command (note: this is a standalone command, not a subcommand):
   
   ```bash
   jentic apis
   ```
   
   Expected output format:
   ```
   VENDOR/NAME/VERSION
   vendor-name/api-name/1.0.0
   ```
   
   The output shows APIs in the format `vendor/name/version`. All three components are required for subsequent operations.

2. **View detailed information about a specific API**
   
   Use the `apis show` command with the full three-part reference:
   
   ```bash
   jentic apis show vendor/name/version
   ```
   
   Expected output includes:
   - API metadata (vendor, name, version)
   - Available operations (HTTP method and path)
   - Operation summaries
   
   Note: Basic output may not show operation IDs. Add `--json` flag to see complete details including operation IDs.

3. **Identify API operations**
   
   From the `apis show` output, note:
   - HTTP methods and paths for each operation
   - Operation summaries describing functionality
   - For programmatic access, use `--json` flag to retrieve operation IDs

4. **Inspect specific operations**
   
   To view detailed information about a specific operation, use the `inspect` command. You have three options:
   
   ```bash
   # Option 1: Using operation ID (from `jentic apis show vendor/name/version --json`)
   jentic inspect <operation-id>
   
   # Option 2: Using METHOD and URL (note: must be quoted as a single argument)
   jentic inspect 'GET https://api.example.com/v1/resource'
   
   # Option 3: Using spec operationId
   jentic inspect <spec-operation-id>
   ```
   
   For markdown-formatted output (more readable):
   ```bash
   jentic inspect <operation-id> --format markdown
   ```

## Quick Reference

- `jentic apis` - List all available APIs
- `jentic apis show vendor/name/version` - Show API details
- `jentic apis show vendor/name/version --json` - Show complete API details including operation IDs
- `jentic inspect <operation-id>` - View detailed operation information
- `jentic inspect 'METHOD URL'` - Inspect operation by HTTP method and URL

## Pitfalls

- **Command naming**: The command is `jentic apis` (plural), not `jentic api list`. The CLI will suggest the correct command if you use the wrong form.

- **API reference format**: Always use the full three-part format `vendor/name/version`. Partial references like `vendor/name` will fail with an error about expecting the version component.

- **Passing arguments**: Use `jentic apis show vendor/name/version` as a single argument, not as separate arguments. The reference must not be split.

- **Inspect command syntax**: When using METHOD and URL format with `jentic inspect`, the entire string must be quoted as a single argument: `jentic inspect 'GET https://...'`. Passing them as separate arguments will fail with "accepts 1 arg(s), received 2".

- **Missing spec files**: Some APIs may return HTTP 500 errors when attempting to retrieve OpenAPI specifications. This indicates the spec file is not stored in the platform. Basic API information (operations, paths, methods) is still available through `apis show`, and detailed operation information can be retrieved using `jentic inspect`.

- **Hidden operation IDs**: Operation IDs are not displayed in default output. Use the `--json` flag if you need operation IDs for programmatic access or broker requests.

- **Search limitations**: The `search` command may return empty results even when APIs exist. If search doesn't find what you need, try browsing with `jentic apis` or `jentic catalog list` instead.

## Verification

Successful discovery is confirmed when:
- `jentic apis` returns a list of one or more APIs without errors
- `jentic apis show vendor/name/version` displays API details including at least one operation
- You can identify the HTTP method and path for operations you want to use
- `jentic inspect` successfully retrieves detailed operation information

```markdown
---
name: add-to-toolkit
description: Request and activate toolkit access to obtain API credentials for making proxied requests through the broker
version: 4
---

# Requesting Toolkit Access for API Credentials

## When to Use

When you need to obtain credentials for an API so you can make authenticated, proxied requests through the Jentic broker. This is required after discovering an API but before you can execute operations against it.

## Prerequisites

- Active agent profile (registered and approved via `jentic register`)
- Knowledge of the API you want to access (vendor/name format for requesting access)
- The API must be available in the registry

## Procedure

1. **Verify current access state**
   
   Check what toolkit bindings you currently have:
   ```bash
   jentic access list
   ```
   
   Or use `whoami` for a more detailed view including scopes and bindings:
   ```bash
   jentic access whoami
   ```
   
   Expected output will show your current bindings. If empty, you'll see no toolkit entries.

2. **Request toolkit access**
   
   Request a toolkit binding for the target API using the `--toolkit` flag with vendor/name format:
   ```bash
   jentic access request --toolkit <vendor>/<api-name> --wait
   ```
   
   **Important**: Use the vendor/name format (e.g., `jentic-test/test-api`), NOT the full vendor/name/version format. The `--wait` flag will block until the request is processed.
   
   Expected output:
   - Request submission confirmation
   - Status updates as the request is processed
   - Final approval status (typically auto-approved within seconds)
   - Toolkit binding ID (format: `tk_<hash>`)

3. **Verify the binding is active**
   
   Confirm the toolkit appears in your access list:
   ```bash
   jentic access whoami
   ```
   
   You should now see the toolkit binding in the `toolkit_bindings` array with status "approved" and the toolkit ID.
   
   **Note**: After a successful approval, the binding is immediately active. Unlike earlier versions, you do NOT need to run `jentic access refresh` separately - the `--wait` flag handles this automatically.

## Quick Reference

- `jentic access list` - View current toolkit bindings (summary)
- `jentic access whoami` - View detailed access info including scopes and bindings
- `jentic access request --toolkit <vendor>/<api> --wait` - Request toolkit access and wait for approval

## Pitfalls

- **Wrong format for API reference**: Use the `vendor/name` format for the `--toolkit` flag (e.g., `jentic-test/test-api`). Including the version (e.g., `jentic-test/test-api/1.0.0`) will result in an "invalid API reference" error.
- **Not using --wait flag**: Without `--wait`, the command returns immediately and you'll need to poll for approval status separately. Using `--wait` provides a better experience for auto-approved requests and automatically activates the binding.
- **Localhost restrictions**: The broker blocks proxying to localhost/127.0.0.1 upstream URLs as a security measure. APIs running on localhost cannot be accessed through the broker proxy, even in development environments. You may see errors like "upstream URL resolves to a blocked address range" when attempting to execute operations against localhost-based APIs.
- **Operation IDs not visible by default**: When listing operations with `jentic apis operations <vendor>/<name>/<version>`, operation IDs are not shown in the default output. Use the `--json` flag to see operation IDs needed for the `jentic execute` command.

## Verification

Run `jentic access whoami` and confirm:
1. Your toolkit binding appears in the `toolkit_bindings` array
2. The status shows "approved"
3. A toolkit ID (starting with `tk_`) is displayed

You are now ready to execute operations against the API using the broker's proxy functionality (provided the API is not running on localhost).
```

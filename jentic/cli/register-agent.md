---
name: register-agent
description: Register a new agent identity on the Jentic platform and obtain authentication credentials
version: 1
---

# Register Agent Identity

## When to Use

When you need to create a new agent identity on the Jentic platform for the first time, before you can authenticate or access any APIs through the broker.

## Prerequisites

- The `jentic` CLI tool must be installed and available in your PATH
- You must have network access to the platform's control plane
- No existing agent profile is required (this creates your first one)

## Procedure

1. **Verify CLI installation**
   ```bash
   jentic --version
   ```
   Confirm the CLI is installed and executable.

2. **Check for existing profiles** (optional)
   ```bash
   jentic profile list
   ```
   If no profiles exist, you'll see an empty list or message indicating no profiles are configured.

3. **Initiate registration**
   ```bash
   jentic register --yes
   ```
   The `--yes` flag automatically accepts prompts. The command will:
   - Submit your registration request to the control plane
   - Automatically poll for admin approval (this may take a few seconds)
   - Download and save authentication tokens locally once approved
   
   Expected output will show:
   - Registration submission confirmation
   - Polling status messages
   - Success message with token save location

4. **Verify authentication tokens**
   ```bash
   jentic profile whoami
   ```
   This should display your agent identity, scopes, and token expiration time. If you see valid token information with time remaining, registration succeeded.

## Quick Reference

- `jentic register --yes` - Register new agent with auto-approval polling
- `jentic profile list` - List configured agent profiles
- `jentic profile whoami` - Display current agent identity and token status

## Pitfalls

- **Manual approval delays**: The registration requires admin approval. The `--yes` flag enables automatic polling, which is recommended. Without it, you may need to manually check approval status.

- **Token storage**: Tokens are automatically saved to your local profile after approval. Note the save location from the output for troubleshooting.

- **Network connectivity**: Registration requires access to the platform's control plane. Ensure you can reach {{ platform.control_plane_url }} before starting.

## Verification

Run `jentic profile whoami` and confirm:
- Your agent identity is displayed
- A valid token is present with remaining time
- Scopes are listed (even if empty initially)

If these details appear, your agent is successfully registered and authenticated.

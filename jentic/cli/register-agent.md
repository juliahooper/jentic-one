---
name: register-agent
description: Register a new agent identity on the Jentic platform and obtain authentication credentials
version: 3
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
   - Automatically poll for admin approval (typically takes 10-15 seconds)
   - Download and save authentication tokens locally once approved
   
   Expected output will show:
   - Registration submission confirmation
   - Polling status messages
   - Success message with token save location (typically `.jentic/profiles/default`)
   - Your assigned agent identity (format: `agnt_<identifier>`)
   - Helpful next-step suggestions

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

- **Manual approval delays**: The registration requires admin approval. The `--yes` flag enables automatic polling, which is recommended. Without it, you may need to manually check approval status. Typical approval time is 10-15 seconds.

- **Token storage**: Tokens are automatically saved to your local profile after approval (typically to `.jentic/profiles/default`). Note the save location from the output for troubleshooting.

- **Network connectivity**: Registration requires access to the platform's control plane. Ensure you can reach the control plane before starting.

- **Authentication is automatic**: Once registration completes, you are immediately authenticated. The JWT tokens (both access and refresh tokens) work transparently for all subsequent CLI commands - no separate authentication step is needed. Tokens typically have 1-hour validity.

## Verification

Run `jentic profile whoami` and confirm:
- Your agent identity is displayed (format: `agnt_<identifier>`)
- A valid token is present with remaining time
- Scopes are listed (even if empty initially)
- Profile shows as "active"

If these details appear, your agent is successfully registered and authenticated.

## Next Steps

After successful registration, you can:
- Browse available APIs: `jentic catalog list`
- View your local API registry: `jentic apis list`
- Search for specific APIs: `jentic catalog search <term>`

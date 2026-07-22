```yaml
---
name: authenticate
description: Exchange credentials for an access token using the Jentic CLI registration or login flow.
version: 3
---

# Authenticate with Jentic Platform

## When to Use

When you need to obtain a valid access token to interact with the Jentic platform APIs, either as a new agent (first-time registration) or returning agent (re-authentication).

## Prerequisites

- Jentic CLI installed and accessible in your PATH
- Network access to the Jentic control plane
- Admin approval available (for new registrations) or existing agent credentials (for re-authentication)

## Procedure

1. **Check existing authentication status**
   ```bash
   jentic profile list
   ```
   - If a profile exists with valid token time remaining, authentication is already complete
   - If no profiles exist or token is expired, proceed to next step

2. **Register as a new agent (first-time authentication)**
   ```bash
   jentic register --yes
   ```
   - The `--yes` flag auto-confirms prompts
   - CLI will automatically poll for admin approval (typically completes within ~10 seconds)
   - Expected output: Success message indicating registration completed
   - Tokens (access + refresh) are automatically saved to your profile

3. **Verify authentication succeeded**
   ```bash
   jentic profile list
   ```
   - Expected output: Profile entry showing your agent name
   - Token should show time remaining (e.g., "1h remaining")
   - Profile should be marked as active

4. **Test authenticated access**
   ```bash
   jentic access whoami
   ```
   - Expected output: JSON showing your agent identity, scopes, and permissions
   - Confirms the token is valid and accepted by the platform
   
   Alternative test:
   ```bash
   jentic apis
   ```
   - Lists APIs in your local registry
   - Any successful API command confirms authentication is working

## Quick Reference

- `jentic profile list` - View saved authentication profiles and token status
- `jentic register --yes` - Register new agent and obtain tokens
- `jentic access whoami` - Verify current authentication and view permissions
- `jentic apis` - List APIs (also confirms authentication is working)

## Pitfalls

- **Registration handles authentication automatically**: The `jentic register` command obtains and saves tokens as part of the registration process. There is no separate "login" step required after successful registration.

- **Token expiration**: Access tokens have a limited lifetime (typically 1 hour). Check token status with `jentic profile list` before starting work. The CLI should handle refresh automatically, but be aware of expiration.

- **Approval waiting**: New agent registrations require admin approval. The `--yes` flag enables automatic polling, but ensure an admin is available to approve your registration request. In typical environments, approval completes within ~10 seconds.

- **Token management is transparent**: Once authenticated, the CLI automatically includes your JWT token in all API requests. You don't need to manually pass tokens or set environment variables.

## Verification

Authentication is successful when:
- `jentic profile list` shows an active profile with time remaining on the token
- `jentic access whoami` returns your agent identity without authentication errors
- Subsequent CLI commands (like `jentic apis` or `jentic catalog`) execute without "unauthorized" or "unauthenticated" errors
```

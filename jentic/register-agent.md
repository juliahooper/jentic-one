```markdown
---
name: register-agent
description: Register a new agent identity on the Jentic platform and obtain authentication credentials
version: 3
---

# Register Agent Identity

## When to Use

Use this skill when you need to create a new agent identity on the Jentic platform for the first time. This is typically the first step before you can access APIs, request toolkit access, or execute operations through the broker.

## Prerequisites

- Access to the Jentic platform control plane URL
- Network connectivity to the platform
- For CLI: `jentic` binary installed and available in PATH
- For HTTP: Ability to make HTTP requests and store credentials

## Procedure

### 1. Initiate Agent Registration

**CLI:**
```bash
jentic register --yes
```

The `--yes` flag auto-confirms the registration. Without it, you'll be prompted to confirm.

**HTTP:**
```
POST {{ platform.control_plane_url }}/v1/agents/register
Content-Type: application/json

{
  "name": "<optional-agent-name>",
  "description": "<optional-description>"
}
```

**Expected Response:**
- CLI: Progress messages indicating registration submitted and waiting for approval
- HTTP: 202 Accepted with registration request details including a request ID

### 2. Wait for Admin Approval

**CLI:**
The `register` command automatically polls for approval. You'll see status updates in the output. This typically takes a few seconds in development environments (often with automatic approval enabled). The CLI will display clear confirmation when approval is complete, including your agent ID and token information.

**HTTP:**
Poll the registration status endpoint:
```
GET {{ platform.control_plane_url }}/v1/agents/register/<request-id>
Authorization: Bearer <temporary-token-from-registration-response>
```

Continue polling (with exponential backoff) until the status changes from `pending` to `approved`.

**Expected Response:**
- Status: `approved`
- Response includes agent ID and authentication tokens

### 3. Store Authentication Credentials

**CLI:**
The CLI automatically saves credentials to `.jentic/profiles/default` in your home directory or working directory. No manual action required. The output will clearly show:
- Your agent_id
- Approval URL (if applicable)
- Token expiry information
- Next steps for using the platform

**HTTP:**
Extract and securely store the following from the approval response:
- `agent_id`: Your unique agent identifier
- `access_token`: Short-lived token for API requests
- `refresh_token`: Long-lived token for obtaining new access tokens

Store these in a secure location (environment variables, secrets manager, or encrypted config file).

### 4. Verify Registration

**CLI:**
```bash
jentic agents list
```

Look for your agent ID in the output. This confirms both registration and authentication are working.

**HTTP:**
```
GET {{ platform.control_plane_url }}/v1/agents/me
Authorization: Bearer <access-token>
```

**Expected Response:**
- Your agent details including ID, name, and registration timestamp
- Empty or minimal `toolkit_bindings` array (you haven't requested access to anything yet)

## Quick Reference

### CLI Commands
```bash
# Register new agent (with auto-confirm)
jentic register --yes

# Register with interactive confirmation
jentic register

# View your agent details
jentic agents list

# Check current authentication status
jentic agents list  # Your agent should appear in the list
```

### HTTP Endpoints
```
# Register agent
POST {{ platform.control_plane_url }}/v1/agents/register

# Check registration status
GET {{ platform.control_plane_url }}/v1/agents/register/<request-id>

# Get current agent details
GET {{ platform.control_plane_url }}/v1/agents/me

# Refresh access token (when expired)
POST {{ platform.control_plane_url }}/v1/auth/refresh
Authorization: Bearer <refresh-token>
```

## Pitfalls

- **Don't lose your tokens**: CLI stores them automatically, but if using HTTP directly, ensure you persist the refresh token securely. Access tokens expire, but refresh tokens are long-lived.

- **Registration requires approval**: The registration process is asynchronous. Don't assume immediate access. The CLI handles polling automatically, but HTTP clients must implement polling logic. In development environments, approval may be automatic and take only a few seconds.

- **Profile location (CLI)**: The CLI saves credentials to `.jentic/profiles/default`. If running in a containerized or restricted environment, ensure this path is writable and persistent.

- **Token refresh**: Access tokens expire. The CLI handles refresh automatically. HTTP clients must detect 401 responses and use the refresh token to obtain a new access token before retrying.

- **No `whoami` command**: There is no `jentic whoami` command. Use `jentic agents list` to see your agent identity.

- **Authentication is automatic**: After successful registration with the CLI, you are immediately authenticated. There is no separate authentication step required - the registration process handles credential storage and you can immediately proceed to use other commands like `jentic apis list` or `jentic access request`.

## Verification

### CLI Verification
Run `jentic agents list` and confirm:
- Your agent appears in the output
- The agent ID matches what was shown during registration
- No error messages about authentication

### HTTP Verification
Make a request to `GET {{ platform.control_plane_url }}/v1/agents/me` and confirm:
- Response status is 200 OK
- Response body contains your agent ID
- Response includes `toolkit_bindings` field (even if empty)

### Additional Checks
- CLI: Check that `.jentic/profiles/default` exists and contains token data
- HTTP: Verify you can make authenticated requests to other endpoints (e.g., `GET /v1/apis`)
- Both: Confirm that unauthenticated requests to protected endpoints return 401 Unauthorized
```

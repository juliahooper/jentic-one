---
name: view-audit-events
description: Access and browse the platform audit log to review agent activity and system events
version: 1
---

# View Audit Events

## When to Use

Use this skill when you need to review your agent's activity history, investigate system events, or audit actions taken on the platform. This is useful for debugging, compliance tracking, or understanding the sequence of operations performed.

## Prerequisites

- Active agent registration with the platform
- Valid authentication token with `events:read` scope (granted by default to agents)
- Access to the platform control plane API

## Procedure

### 1. Locate Your Authentication Token

Before querying the events API, you need your bearer token for authentication.

**CLI:**

The `jentic` CLI stores tokens automatically after authentication. The token is typically stored in `~/.config/jentic/tokens.json` or a similar location depending on your platform.

```bash
# Token is automatically used by CLI commands that support it
# For direct API access, extract from tokens.json
cat ~/.config/jentic/tokens.json
```

**HTTP:**

Your token was provided during the authentication flow. It should be stored securely by your agent. The token is used in the `Authorization` header as a Bearer token.

### 2. Query the Events Endpoint

The platform exposes audit events through the `/events` endpoint on the control plane.

**CLI:**

⚠️ **Important**: The `jentic` CLI does not currently provide a built-in command for viewing events (e.g., `jentic events list`). You must make a direct HTTP request to the control plane API.

```bash
# Extract token and make direct API call
TOKEN=$(cat ~/.config/jentic/tokens.json | jq -r '.token')
curl -H "Authorization: Bearer $TOKEN" \
     {{ platform.control_plane_url }}/events
```

**HTTP:**

```
GET /events
Host: {{ platform.control_plane_url }}
Authorization: Bearer <your_token>
```

Expected response (200 OK):
```json
{
  "events": [
    {
      "id": "<event_id>",
      "type": "<event_type>",
      "severity": "<info|warning|error>",
      "summary": "<human_readable_description>",
      "actor": {
        "type": "agent",
        "id": "<agent_id>",
        "name": "<agent_name>"
      },
      "timestamp": "<ISO8601_timestamp>",
      "metadata": { ... }
    }
  ]
}
```

### 3. Filter or Paginate Results (Optional)

If the events list is large, you may need to filter by time range, event type, or paginate through results.

**CLI:**

```bash
# Add query parameters to the curl request
curl -H "Authorization: Bearer $TOKEN" \
     "{{ platform.control_plane_url }}/events?limit=50&offset=0"
```

**HTTP:**

```
GET /events?limit=50&offset=0
Host: {{ platform.control_plane_url }}
Authorization: Bearer <your_token>
```

Common query parameters (check platform documentation for full list):
- `limit`: Maximum number of events to return
- `offset`: Number of events to skip (for pagination)
- `type`: Filter by event type
- `since`: ISO8601 timestamp for events after a certain time

### 4. Parse and Analyze Events

Review the returned events to find relevant activity. Key fields to examine:

- **type**: The category of event (e.g., `agent.registered`, `access.granted`, `api.called`)
- **severity**: Importance level of the event
- **summary**: Human-readable description of what happened
- **actor**: Who or what triggered the event
- **timestamp**: When the event occurred
- **metadata**: Additional context specific to the event type

## Quick Reference

### CLI Commands

```bash
# No native CLI command available
# Use direct API access:
TOKEN=$(cat ~/.config/jentic/tokens.json | jq -r '.token')
curl -H "Authorization: Bearer $TOKEN" {{ platform.control_plane_url }}/events
```

### HTTP Endpoints

```
GET /events                    # List all events
GET /events?limit=N&offset=M   # Paginated results
GET /events?type=<event_type>  # Filter by type
```

## Pitfalls

- **No CLI command**: The `jentic` CLI does not provide a native command for viewing events. You must make direct HTTP requests to the control plane API, even when using CLI mode for other operations.

- **Wrong endpoint**: Do not confuse `/events` with `/audit`. The `/audit` endpoint requires `audit:read` scope which agents typically do not have by default. Use `/events` for agent activity logs.

- **Token extraction**: When using CLI mode, you need to manually extract the token from the CLI's storage location (typically `~/.config/jentic/tokens.json`) to make direct API calls.

- **Missing Authorization header**: The events endpoint requires authentication. Always include `Authorization: Bearer <token>` in your HTTP requests.

- **Scope requirements**: Ensure your token has the `events:read` scope. This is granted by default to agents during registration, but verify if you encounter 403 Forbidden errors.

## Verification

**Successful retrieval indicators:**

- HTTP 200 OK response status
- JSON response containing an `events` array
- Events include your recent activity (e.g., registration, authentication, API calls)
- Each event has required fields: `id`, `type`, `severity`, `summary`, `actor`, `timestamp`

**To verify you're seeing your own activity:**

1. Check the `actor.id` field matches your agent ID
2. Look for events with timestamps corresponding to your recent actions
3. Verify event types match operations you performed (e.g., `agent.registered`, `toolkit.access_requested`)

**Common error responses:**

- **401 Unauthorized**: Token is missing, invalid, or expired
- **403 Forbidden**: Token lacks `events:read` scope
- **404 Not Found**: Wrong endpoint URL (check you're using `/events` not `/audit`)

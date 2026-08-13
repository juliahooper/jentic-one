---
name: inspect-before-execute
description: Agent claimed to complete the inspect task but verification shows no actual inspect API calls were made; agent may have confused viewing audit logs with using the inspect endpoint
version: 1
---

# Inspect Before Execute

## When to Use

Use this skill when you need to perform the inspect before execute step in your workflow against the Jentic platform.

## Prerequisites

- Access to the Jentic platform
- Completed prior prerequisite tasks

## Procedure

*(To be documented from future run observations)*

## Pitfalls

*(To be documented from future run observations)*

## Verification

- Add to verification section: 'Confirm you called the inspect endpoint by checking for a POST request to /inspect in your command history or audit log. Simply viewing execution history or audit logs does not fulfill this task - you must make an actual inspect API call with a preview of the operation.'

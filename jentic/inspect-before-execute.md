---
name: inspect-before-execute
description: Documentation should include verification steps to confirm the inspect endpoint was actually called, not just that the agent understands the concept.
version: 1
---

# Inspect Before Execute

## When to Use

(Generated from QA harness observations)

## Prerequisites

- (To be documented based on run observations)

## Procedure

- (To be documented)

## Quick Reference

- (To be documented)

## Pitfalls

- (None identified yet)

## Verification

- Add to verification section: 'Confirm you called the inspect endpoint by checking for a POST request to /inspect in your command history or audit log. Simply viewing execution history or audit logs does not fulfill this task - you must make an actual inspect API call with a preview of the operation.'

# Claude Code Guide

This file contains guidelines and preferences for working with Claude Code in this project.

## Project Context

Working directory: C:\Users\Justin Pai\my-sw-projects
Platform: Windows (win32)

## Communication Preferences

- Keep responses concise and focused
- Use technical accuracy over validation
- Provide direct, objective guidance
- Use GitHub-flavored markdown for formatting

## Development Workflow

### Code Changes
- Always read files before modifying them
- Prefer editing existing files over creating new ones
- Avoid over-engineering - only make necessary changes
- Don't add features beyond what's requested
- Keep solutions simple and focused

### Security
- Watch for common vulnerabilities (XSS, SQL injection, command injection, etc.)
- Validate only at system boundaries (user input, external APIs)
- Trust internal code and framework guarantees

### Task Management
- Use TodoWrite for planning and tracking complex tasks
- Break down large tasks into smaller steps
- Mark todos as completed immediately after finishing

## Tool Usage

### Preferred Tools
- **Read** for reading files (not cat/head/tail)
- **Edit** for editing files (not sed/awk)
- **Write** for creating new files (not echo/cat)
- **Grep** for searching code content
- **Glob** for finding files by pattern
- **Bash** only for actual terminal operations

### File Operations
- Use absolute paths when possible
- Quote paths with spaces using double quotes
- Verify parent directories exist before creating new files/folders

## Git Workflow

### Commits
- Only commit when explicitly requested
- Never skip hooks unless explicitly requested
- Follow existing commit message style
- Include concise messages focusing on "why" not "what"
- Never force push to main/master

### Pull Requests
- Analyze full commit history, not just latest commit
- Create comprehensive PR summaries
- Include test plan in PR description

## Code Style

- Follow existing patterns in the codebase
- Don't add comments where logic is self-evident
- Only add docstrings/comments to code you're changing
- Delete unused code completely (no backwards-compatibility hacks)

## Custom Preferences

Add your project-specific preferences below:

---

Last updated: 2025-12-17

# Command: /run-prd

Execute a PRD using the orchestrator skill.

## Usage
/run-prd <path-to-prd-file>

## Steps
1. Load the orchestrator skill from `.cursor/skills/signal-lab-orchestrator/SKILL.md`.
2. Pass the PRD path as input.
3. Follow the orchestrator's phase sequence: analyze > scan > plan > decompose > implement > review > report.
4. Use `context.json` to track state and resume on failure.
5. Report results at the end.

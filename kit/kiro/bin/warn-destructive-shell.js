#!/usr/bin/env node
'use strict';

// Warns when a shell command matches a destructive pattern.
// Reads the session payload from STDIN. Writes nothing: no log, no file, no
// persisted command text, so no secret can leak into a log.
//
// Enforcement is NOT here. Destructive operations are blocked by the
// `permissions` rules in .kiro/agents/*.md, which deny-overrides.
// Exit code is 0 by design; see kit/README.md before changing it.

const fs = require('fs');

let payload = '';
try {
  payload = fs.readFileSync(0, 'utf8');
} catch (error) {
  payload = '';
}

const pattern = /rm\s+-[a-z]*r|rm\s+-[a-z]*f|rmdir\s|git\s+push\s+(-f|--force)|git\s+reset\s+--hard|git\s+clean\s+-[a-z]*f|sudo\s|npm\s+publish|chmod\s+777|curl[^|]*\|\s*(sh|bash)|wget[^|]*\|\s*(sh|bash)/i;

if (pattern.test(payload)) {
  console.error('warn-destructive-shell: destructive pattern detected. Agent permissions are the enforcement layer.');
}

process.exit(0);

#!/usr/bin/env node
'use strict';

// Stop-time checks. Detects the project's runner and runs the suite once.
// Exits non-zero when the suite fails, so the failure is visible before the
// session is reported as finished.

const fs = require('fs');
const { spawnSync } = require('child_process');

const useShell = process.platform === 'win32';

function has(command, args) {
  const result = spawnSync(command, args, { stdio: 'ignore', shell: useShell });
  return result.status === 0;
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: useShell });
  return result.status === null ? 1 : result.status;
}

function line(text) {
  console.log(text);
}

let status = 0;

if (fs.existsSync('go.mod')) {
  if (has('go', ['version'])) {
    line('=== go test ./... ===');
    status = run('go', ['test', './...']) || status;
  } else {
    line('stop-checks: Go project detected but the go toolchain is not available');
  }
} else if (fs.existsSync('package.json')) {
  if (has('npm', ['--version'])) {
    let hasTestScript = false;
    let parsed = true;
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      hasTestScript = Boolean(
        pkg.scripts &&
        typeof pkg.scripts.test === 'string' &&
        pkg.scripts.test.trim()
      );
    } catch (error) {
      parsed = false;
      line('stop-checks: package.json could not be read; skipping npm test');
    }
    if (hasTestScript) {
      line('=== npm test ===');
      status = run('npm', ['test', '--silent']) || status;
    } else if (parsed) {
      line('stop-checks: package.json has no test script');
    }
  } else {
    line('stop-checks: Node project detected but npm is not available');
  }
} else if (fs.existsSync('pyproject.toml') || fs.existsSync('pytest.ini')) {
  let python = null;
  if (has('python3', ['--version'])) {
    python = ['python3'];
  } else if (has('python', ['--version'])) {
    python = ['python'];
  } else if (has('py', ['-3', '--version'])) {
    python = ['py', '-3'];
  }
  if (python) {
    line('=== pytest ===');
    status = run(python[0], python.slice(1).concat(['-m', 'pytest', '-q'])) || status;
  } else {
    line('stop-checks: Python project detected but no Python launcher is available');
  }
} else if (fs.existsSync('Cargo.toml')) {
  if (has('cargo', ['--version'])) {
    line('=== cargo test ===');
    status = run('cargo', ['test', '--quiet']) || status;
  } else {
    line('stop-checks: Rust project detected but cargo is not available');
  }
} else {
  line('stop-checks: no known runner detected (go.mod, package.json, pyproject.toml, Cargo.toml)');
}

line('=== working tree ===');
if (has('git', ['--version'])) {
  const tree = spawnSync('git', ['status', '--short'], { encoding: 'utf8', shell: useShell });
  if (tree.status === 0 && tree.stdout) {
    console.log(String(tree.stdout).replace(/\s+$/, ''));
  }
} else {
  line('(git not available on this machine)');
}

process.exit(status);

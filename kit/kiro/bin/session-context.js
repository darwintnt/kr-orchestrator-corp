#!/usr/bin/env node
'use strict';

// Session hydration. Hooks run in the project root.
// Prints context only; it never writes and never fails the session.

const fs = require('fs');
const { spawnSync } = require('child_process');

function git(args) {
  const result = spawnSync('git', args, {
    encoding: 'utf8',
    shell: process.platform === 'win32'
  });
  return result.status === 0 ? String(result.stdout || '').replace(/\s+$/, '') : null;
}

function section(title) {
  console.log('=== ' + title + ' ===');
}

function main() {
  section('branch');
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  console.log(branch === null ? '(not a git repo)' : branch);

  section('working tree');
  const status = git(['status', '--short']);
  if (status) console.log(status);

  section('recent commits');
  const log = git(['log', '--oneline', '-20']);
  if (log) console.log(log);

  section('MEMORY.md (tail)');
  try {
    const lines = fs.readFileSync('MEMORY.md', 'utf8').split(/\r?\n/);
    console.log(lines.slice(-40).join('\n'));
  } catch (error) {
    console.log('(no MEMORY.md)');
  }

  section('decisions');
  try {
    const files = fs.readdirSync('docs/decisions').sort();
    console.log(files.slice(-10).join('\n'));
  } catch (error) {
    console.log('(no docs/decisions)');
  }

  section('active specs');
  try {
    console.log(fs.readdirSync('.kiro/specs').join('\n'));
  } catch (error) {
    console.log('(no .kiro/specs)');
  }

  section('open ODD tasks');
  try {
    console.log(fs.readdirSync('odd/tasks').join('\n'));
  } catch (error) {
    console.log('(none)');
  }
}

try {
  main();
} catch (error) {
  // A context print must never fail the session.
}

process.exit(0);

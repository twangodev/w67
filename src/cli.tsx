#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import { App } from './App.js';

const cli = meow(`
  Usage
    $ 67 < input
    $ echo "text" | 67

  Options
    -d, --duration    Animation duration in ms (default: 3000)
    -i, --intensity   Max tilt in rows (default: 4)
    -f, --fps         Frames per second (default: 30)
    --no-settle       Rock forever without decay

  Examples
    $ echo "HELLO WORLD" | 67
    $ ls -la | 67 --duration 5000
    $ figlet "67" | 67 --intensity 6
`, {
  importMeta: import.meta,
  flags: {
    duration: {
      type: 'number',
      shortFlag: 'd',
      default: 3000
    },
    intensity: {
      type: 'number',
      shortFlag: 'i',
      default: 4
    },
    fps: {
      type: 'number',
      shortFlag: 'f',
      default: 30
    },
    settle: {
      type: 'boolean',
      default: true
    }
  }
});

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk: string) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
  });
}

async function main(): Promise<void> {
  const input = await readStdin();

  if (!input.trim()) {
    process.exit(0);
  }

  const options = {
    duration: cli.flags.duration,
    intensity: cli.flags.intensity,
    fps: cli.flags.fps,
    settle: cli.flags.settle
  };

  const { waitUntilExit } = render(<App input={input} options={options} />);
  await waitUntilExit();
}

main().catch((err: Error) => {
  console.error(err);
  process.exit(1);
});
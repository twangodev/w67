#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import figlet from 'figlet';
import { App } from './App.js';
import { initializeFonts } from './fonts.js';

initializeFonts();

const cli = meow(`
  Usage
    $ w67 "text"              # renders as ASCII art
    $ echo "text" | w67       # animates raw text

  Options
    -d, --duration    Animation duration in ms (default: 3000)
    -i, --intensity   Max tilt in rows (default: 4)
    -f, --fps         Frames per second (default: 30)
    -F, --font        Figlet font (default: ANSI Shadow)
    --no-settle       Rock forever without decay

  Examples
    $ w67 "67"
    $ w67 "HELLO" --font Slant
    $ ls -la | w67
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
    font: {
      type: 'string',
      shortFlag: 'F',
      default: 'ANSI Shadow'
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

function renderFiglet(text: string, font: string): Promise<string> {
  return new Promise((resolve, reject) => {
    figlet.text(text, { font }, (err, result) => {
      if (err) reject(err);
      else resolve(result ?? text);
    });
  });
}

async function main(): Promise<void> {
  let input: string;
  let useFiglet = false;

  if (!process.stdin.isTTY) {
    input = await readStdin();
  } else if (cli.input.length > 0) {
    input = cli.input.join(' ');
    useFiglet = true;
  } else {
    input = '67';
    useFiglet = true;
  }

  if (!input.trim()) {
    process.exit(0);
  }

  if (useFiglet) {
    input = await renderFiglet(input.trim(), cli.flags.font);
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

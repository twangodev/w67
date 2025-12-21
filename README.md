```bash
██╗    ██╗ ██████╗███████╗
██║    ██║██╔════╝╚════██║
██║ █╗ ██║███████╗    ██╔╝
██║███╗██║██╔═══██╗  ██╔╝
╚███╔███╔╝╚██████╔╝  ██║
 ╚══╝╚══╝  ╚═════╝   ╚═╝
```

[![npm version](https://img.shields.io/npm/v/w67.svg)](https://www.npmjs.com/package/w67)
[![npm downloads](https://img.shields.io/npm/dm/w67.svg)](https://www.npmjs.com/package/w67)
[![license](https://img.shields.io/github/license/twangodev/w67.svg)](http://www.wtfpl.net/)

Animate terminal output **_with 67._**

## Installation

This package is small enough to run without installation using `npx`:

```bash
npx w67
```

If you are a 67 enthusiast and want to have it installed globally, you can do so with:

```bash
npm install -g w67
```

## Usage

```bash
npx w67                     # default "67" ASCII art
npx w67 "HELLO"             # custom text as ASCII art
echo "text" | npx w67       # animate piped input
```

For reference of all options:

```bash
npx w67 --help
```
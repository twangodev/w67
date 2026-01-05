/**
 * Cross-Platform Binary Builder
 *
 * Builds standalone executables for all supported platforms using Bun.
 * Run with: bun scripts/build-binaries.ts
 */

import { $ } from "bun";
import { mkdir } from "fs/promises";

const targets = [
  // macOS
  { target: "bun-darwin-arm64", out: "w67-darwin-arm64" },
  { target: "bun-darwin-x64", out: "w67-darwin-x64" },
  // Linux
  { target: "bun-linux-x64", out: "w67-linux-x64" },
  { target: "bun-linux-arm64", out: "w67-linux-arm64" },
  // Linux (Alpine/musl)
  { target: "bun-linux-x64-musl", out: "w67-linux-x64-musl" },
  { target: "bun-linux-arm64-musl", out: "w67-linux-arm64-musl" },
  // Windows
  { target: "bun-windows-x64", out: "w67-windows-x64.exe" },
];

console.log("Building binaries for all platforms...\n");

await mkdir("dist/bin", { recursive: true });

let success = 0;
let failed = 0;

for (const { target, out } of targets) {
  try {
    console.log(`Building ${out}...`);
    await $`bun build ./dist/cli.js --compile --target=${target} --outfile dist/bin/${out}`.quiet();
    console.log(`  ✓ ${out}`);
    success++;
  } catch (error) {
    console.error(`  ✗ ${out} - Failed`);
    failed++;
  }
}

console.log(`\nDone! ${success} succeeded, ${failed} failed.`);
console.log("Binaries are in dist/bin/");

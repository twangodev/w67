import { $ } from "bun";

const targets = [
  "bun-darwin-arm64",
  "bun-darwin-x64",
  "bun-linux-x64",
  "bun-linux-arm64",
  "bun-linux-x64-musl",
  "bun-linux-arm64-musl",
  "bun-windows-x64",
];

await $`mkdir -p dist/bin`;

for (const target of targets) {
  const out = `w67-${target.replace("bun-", "")}${target.includes("windows") ? ".exe" : ""}`;
  await $`bun build ./dist/cli.js --compile --target=${target} --outfile dist/bin/${out}`;
}
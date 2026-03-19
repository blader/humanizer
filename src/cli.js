import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { SYSTEM_PROMPT } from "./prompt.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

const USAGE = `
humanizer — bundle humanizer prompts with your text, pipe to any LLM

Usage:
  humanizer <file>              Read from file
  cat file | humanizer          Read from stdin
  humanizer --clipboard         Read from macOS clipboard
  humanizer --prompt-only       Output system prompt only

Examples:
  humanizer essay.txt | claude --print
  cat essay.txt | humanizer | llm
  humanizer --clipboard | claude --print

Flags:
  -h, --help          Show this help
  -v, --version       Show version
  -c, --clipboard     Read input from macOS clipboard (pbpaste)
  -p, --prompt-only   Output only the system prompt (no input text)
`.trim();

function parseCliArgs(argv) {
  const { values, positionals } = parseArgs({
    args: argv.slice(2),
    options: {
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
      clipboard: { type: "boolean", short: "c", default: false },
      "prompt-only": { type: "boolean", short: "p", default: false },
    },
    allowPositionals: true,
    strict: true,
  });
  return { flags: values, positionals };
}

function readStdinSync() {
  try {
    return readFileSync(0, "utf-8");
  } catch {
    return "";
  }
}

function readClipboard() {
  try {
    return execFileSync("pbpaste", [], { encoding: "utf-8" });
  } catch {
    process.stderr.write("Error: could not read clipboard (pbpaste failed)\n");
    process.exit(1);
  }
}

function readFile(filePath) {
  try {
    return readFileSync(filePath, "utf-8");
  } catch (err) {
    process.stderr.write(`Error: could not read file "${filePath}": ${err.message}\n`);
    process.exit(1);
  }
}

function stdinIsTTY() {
  return process.stdin.isTTY === true;
}

export function run(argv = process.argv) {
  let flags, positionals;
  try {
    ({ flags, positionals } = parseCliArgs(argv));
  } catch (err) {
    process.stderr.write(`${err.message}\n\n${USAGE}\n`);
    process.exit(1);
  }

  if (flags.help) {
    process.stdout.write(USAGE + "\n");
    return;
  }

  if (flags.version) {
    process.stdout.write(pkg.version + "\n");
    return;
  }

  if (flags["prompt-only"]) {
    process.stdout.write(SYSTEM_PROMPT + "\n");
    return;
  }

  // Resolve input text: file arg → clipboard → stdin → show help
  let inputText = "";

  if (positionals.length > 0) {
    inputText = readFile(positionals[0]);
  } else if (flags.clipboard) {
    inputText = readClipboard();
  } else if (!stdinIsTTY()) {
    inputText = readStdinSync();
  } else {
    // No input source — show help
    process.stdout.write(USAGE + "\n");
    return;
  }

  inputText = inputText.trim();
  if (!inputText) {
    process.stderr.write("Error: input is empty\n");
    process.exit(1);
  }

  // Output bundled prompt
  process.stdout.write(`${SYSTEM_PROMPT}\n\nHumanize the following text:\n\n${inputText}\n`);
}

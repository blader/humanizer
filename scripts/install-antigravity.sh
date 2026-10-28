#!/usr/bin/env bash
# Install Humanizer skill for Google Antigravity and Gemini agents.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SOURCE_SKILL="${REPO_ROOT}/SKILL.md"

if [[ ! -f "${SOURCE_SKILL}" ]]; then
  echo "Error: Source skill not found at ${SOURCE_SKILL}" >&2
  exit 1
fi

MODE="global"
TARGET_DIR=""
USE_SYMLINK=false

usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Install Humanizer as an active skill for Google Antigravity and Gemini.

Options:
  --global             Install globally to ~/.gemini/config/skills/humanizer (default)
  --target <dir>       Install to a specific directory (e.g., /path/to/project/.agents/skills/humanizer)
  --symlink            Create a symbolic link to SKILL.md instead of copying
  -h, --help           Show this help message
EOF
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --global)
      MODE="global"
      shift
      ;;
    --target)
      MODE="custom"
      TARGET_DIR="$2"
      shift 2
      ;;
    --symlink)
      USE_SYMLINK=true
      shift
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      ;;
  esac
done

if [[ "${MODE}" == "global" ]]; then
  DEST_DIR="${HOME}/.gemini/config/skills/humanizer"
else
  DEST_DIR="${TARGET_DIR}"
fi

echo "Installing Humanizer skill into: ${DEST_DIR}"
mkdir -p "${DEST_DIR}"

DEST_FILE="${DEST_DIR}/SKILL.md"

if [[ "${USE_SYMLINK}" == true ]]; then
  ln -sf "${SOURCE_SKILL}" "${DEST_FILE}"
  echo "Created symlink: ${DEST_FILE} -> ${SOURCE_SKILL}"
else
  cp "${SOURCE_SKILL}" "${DEST_FILE}"
  echo "Copied skill file to: ${DEST_FILE}"
fi

echo "Successfully installed Humanizer for Google Antigravity!"
echo "To use it, restart Antigravity or ask: 'Humanize this text: ...' or '/humanizer'"

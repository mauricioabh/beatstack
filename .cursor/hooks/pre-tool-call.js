/**
 * Pre-tool-call hook: blocks dangerous commands and warns on sensitive file edits.
 */

const BLOCKED_PATTERNS = [
  "rm -rf",
  "DROP TABLE",
  "DROP DATABASE",
  "git reset --hard",
  "git push --force",
  "git push -f",
  "DELETE FROM",
  "TRUNCATE TABLE",
  "format c:",
  "del /f /s /q",
];

const WARN_FILES = [
  "lib/prompt.ts",
  "lib/store.ts",
  "lib/types.ts",
  "lib/nodeConfigs.ts",
];

module.exports = async function preToolCall({ tool, args }) {
  const content = JSON.stringify(args ?? "").toLowerCase();

  for (const pattern of BLOCKED_PATTERNS) {
    if (content.includes(pattern.toLowerCase())) {
      return {
        block: true,
        reason: `Blocked: detected dangerous pattern "${pattern}". Request explicit user approval before proceeding.`,
      };
    }
  }

  const filePath = args?.path ?? args?.file_path ?? "";
  for (const sensitive of WARN_FILES) {
    if (filePath.includes(sensitive)) {
      return {
        warn: true,
        message: `Warning: editing sensitive file "${sensitive}". Prompt assembly or presets may be affected.`,
      };
    }
  }

  return { block: false };
};

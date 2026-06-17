import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const noPush = process.env.GH_PAGES_NO_PUSH === "true";
const askpassDirectory = await mkdtemp(path.join(tmpdir(), "mt-otjiku-gh-pages-"));
const askpassPath = path.join(askpassDirectory, "askpass.sh");

function run(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: { ...process.env, ...env },
      stdio: "inherit",
      shell: false,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

try {
  await run("npx", ["gh-pages-clean"]);

  if (token) {
    await writeFile(
      askpassPath,
      [
        "#!/bin/sh",
        'case "$1" in',
        '  *Username*) printf "%s\\n" "x-access-token" ;;',
        '  *Password*) printf "%s\\n" "$GITHUB_TOKEN" ;;',
        '  *) printf "\\n" ;;',
        "esac",
        "",
      ].join("\n"),
      { mode: 0o700 },
    );
  }

  await run(
    "npx",
    ["gh-pages", "-d", "out", ...(noPush ? ["--no-push"] : [])],
    token
      ? {
          GIT_ASKPASS: askpassPath,
          GIT_TERMINAL_PROMPT: "0",
          GITHUB_TOKEN: token,
        }
      : {},
  );
} catch (error) {
  if (!token) {
    console.error(
      [
        "",
        "GitHub rejected the deploy because this shell has no usable HTTPS token and SSH auth is not available.",
        "Create a fine-grained GitHub token with Contents: Read and write, then run:",
        "",
        "  GITHUB_TOKEN=your_token npm run deploy",
        "",
        "The token is passed through GIT_ASKPASS and is not written to package.json.",
        "",
      ].join("\n"),
    );
  }

  throw error;
} finally {
  await rm(askpassDirectory, { force: true, recursive: true });
}

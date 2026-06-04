import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const nextDir = join(process.cwd(), ".next");
const PORTS = [3000, 3001, 3002];

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function killListenersOnPorts() {
  if (process.platform !== "win32") return;

  for (const port of PORTS) {
    try {
      const script = [
        "$pids = Get-NetTCPConnection -LocalPort",
        port,
        "-ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique;",
        "foreach ($id in $pids) { if ($id) { Stop-Process -Id $id -Force -ErrorAction SilentlyContinue } }",
      ].join(" ");
      execSync(`powershell -NoProfile -Command "${script}"`, { stdio: "ignore" });
    } catch {
      // port free or no permission
    }
  }

  try {
    const filter = "name='node.exe'";
    const list = execSync(
      `powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"${filter}\\" | Where-Object { $_.CommandLine -match 'next dev|beatstack' } | Select-Object -ExpandProperty ProcessId"`,
      { encoding: "utf8" },
    );
    for (const line of list.split(/\r?\n/)) {
      const pid = Number.parseInt(line.trim(), 10);
      if (pid > 0) {
        try {
          process.kill(pid);
        } catch {
          // already gone
        }
      }
    }
  } catch {
    // ignore
  }
}

function removeNextDir(maxAttempts = 8) {
  if (!existsSync(nextDir)) {
    console.log(".next: nothing to remove");
    return;
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      rmSync(nextDir, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 300,
      });
      console.log(".next removed");
      return;
    } catch (err) {
      if (attempt === maxAttempts) {
        console.error(
          "\nCould not delete .next — a dev server or editor may still be locking files.",
        );
        console.error("Close other terminals running `next dev`, then run: npm run clean:next\n");
        throw err;
      }
      if (attempt === 1) killListenersOnPorts();
      sleep(400 * attempt);
    }
  }
}

killListenersOnPorts();
sleep(500);
removeNextDir();

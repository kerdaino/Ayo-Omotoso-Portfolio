import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = dirname(scriptsDirectory);
const studioDirectory = join(repositoryRoot, "studio");
const localEnvironmentFile = join(repositoryRoot, ".env.local");
const sanityExecutable = join(repositoryRoot, "node_modules", ".bin", "sanity");

if (existsSync(localEnvironmentFile)) {
  loadEnvFile(localEnvironmentFile);
}

const sanityProcess = spawn(sanityExecutable, process.argv.slice(2), {
  cwd: studioDirectory,
  env: process.env,
  stdio: "inherit",
});

sanityProcess.on("error", (error) => {
  console.error(`Unable to start the local Sanity CLI: ${error.message}`);
  process.exitCode = 1;
});

sanityProcess.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exitCode = code ?? 1;
});

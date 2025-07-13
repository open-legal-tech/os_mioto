import { exec } from "child_process";
import path from "path";
import { parseArgs } from "util";
import { promisify } from "util";

const execAsync = promisify(exec);

async function runTests() {
  const { positionals } = parseArgs({
    args: process.argv,
    strict: true,
    allowPositionals: true,
  });

  // Construct the path to the playwright.config.ts file
  const playwrightConfigPath = path.join(process.cwd(), "playwright.config.ts");

  const testCommand = `PWDEBUG=1 PLAYWRIGHT_HTML_REPORT=playwright-report-debug playwright test --config=${playwrightConfigPath} -g '${positionals[2]}' --project=chromium --output=test-results-debug`;

  try {
    const { stdout, stderr } = await execAsync(testCommand);
    console.log(stdout);
    if (stderr) {
      console.error("Error:", stderr);
    }
  } catch (error) {
    console.error("Execution error:", error);
  }
}

runTests();

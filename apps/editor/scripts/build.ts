import { spawn } from "child_process";
import fs from "fs-extra";

async function runBuildCommandAsync() {
  await fs.remove("./out");
  const buildProcess = spawn("pnpm", ["next", "build"], {
    stdio: "inherit",
  });

  buildProcess.on("exit", async (code) => {
    if (code === 0) {
      console.log("Build completed successfully.");
      try {
        await fs.copy(".next/standalone", "./out");
        await fs.copy(".next/static", "./out/apps/editor/.next/static");
        await fs.copy("./public", "./out/apps/editor/public");
        await fs.copy("../../node_modules/argon2", "./out/node_modules/argon2");
        console.log("Files copied successfully to ./out");
      } catch (copyError) {
        console.error(`Error copying files: ${copyError}`);
      }
    } else {
      console.error(`Build process exited with code ${code}`);
    }
  });
}

await runBuildCommandAsync();

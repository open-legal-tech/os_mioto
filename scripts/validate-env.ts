import { exec } from "child_process";
import fs from "fs";
import path from "path";

const packageJsonPath = path.join(process.cwd(), "package.json");
const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
const packageJson = JSON.parse(packageJsonContent);

console.log(`Checking env for \x1b[32m${packageJson.name}\x1b[0m`);

// Command to be executed
const command = `pnpm list -F ${packageJson.name} --only-projects --json`;

const execPromise = (cmd: string) => {
  return new Promise<string>((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(`exec error: ${error}`);
        return;
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
};

try {
  const stdout = await execPromise(command);
  const parsedStdout = JSON.parse(stdout)[0];

  console.log("Checked dependencies:");
  await Promise.allSettled(
    [
      ...Object.entries<any>(parsedStdout?.dependencies),
      [parsedStdout.name, { path: parsedStdout?.path }],
    ].map(async ([name, dependency]) => {
      console.log(name);
      const path = `${dependency?.path}/env.ts`;

      if (fs.existsSync(path)) {
        await import(path);
      }
    }),
  );
} catch (error) {
  process.stderr.write(error?.message);
  process.exit(1);
}

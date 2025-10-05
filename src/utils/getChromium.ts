import {spawn} from "child_process";

const getChromiumPath = async () => {
  return new Promise<string>((resolve) => {
    const proc = spawn("which", ["chromium"]);

    let output = "";
    let errorOutput = "";

    proc.stdout.on("data", (data: Buffer) => output += data.toString());
    proc.stderr.on("data", (data: Buffer) => errorOutput += data.toString());

    proc.on("close", (code: number) => {
      if (code === 0) resolve(output.trim());
      else throw new Error(`Failed to find chromium: ${errorOutput}`);
    });
  });
};

export default getChromiumPath;
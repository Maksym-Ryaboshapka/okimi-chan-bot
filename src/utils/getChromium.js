const {spawn} = require("child_process");

const getChromiumPath = async () => {
  return new Promise((resolve, reject) => {
    const proc = spawn("which", ["chromium"]);

    let output = "";
    let errorOutput = "";

    proc.stdout.on("data", (data) => output += data.toString());
    proc.stderr.on("data", (data) => errorOutput += data.toString());

    proc.on("close", (code) => {
      if (code === 0) resolve(output.trim());
      else reject(new Error(`Failed to find chromium: ${errorOutput}`));
    });
  });
};

module.exports = getChromiumPath;
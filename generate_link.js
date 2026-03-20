const config = {
  type: "stdio",
  command: "npx",
  args: ["-y", "unsplashx"],
  env: {
    "UNSPLASH_ACCESS_KEY": ""
  }
};

const base64Config = Buffer.from(JSON.stringify(config)).toString("base64");
const deepLink = `cursor://anysphere.cursor-deeplink/mcp/install?name=unsplashx&config=${base64Config}`;

console.log("Deep Link for Cursor:");
console.log(deepLink);

# UnsplashX MCP

Model Context Protocol (MCP) server for the Unsplash API.

I got tired of AI-generated images. I wanted a fast way to use real photography in my projects and, most importantly, make sure real photographers get the credit they deserve. That's why I built **UnsplashX**.

With this MCP server, your AI agent can search, download, and insert Unsplash images directly into your files while always respecting mandatory attribution.

## ⚡ Quick Install

Add it to your favorite IDE with one click:

**Cursor:** [<img src="https://img.shields.io/badge/Add%20to-Cursor-000?style=for-the-badge&logo=cursor&logoColor=white" alt="Add to Cursor">](https://cursor.com/en/install-mcp?name=unsplashx&config=eyJjb21tYW5kIjoibnB4IC15IHVuc3BsYXNoeCJ9)
**VS Code:** [<img src="https://img.shields.io/badge/VS_Code-VS_Code?style=for-the-badge&label=Add%20to&color=0098FF" alt="Add to VS Code">](https://vscode.dev/redirect/mcp/install?name=unsplashx&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22unsplashx%22%5D%2C%22env%22%3A%7B%7D%7D)

## Manual Setup

If you prefer to configure Claude Desktop or Cursor manually:

```json
{
  "mcpServers": {
    "unsplash": {
      "command": "npx",
      "args": ["-y", "unsplashx", "YOUR_ACCESS_KEY_HERE"]
    }
  }
}
```

## Features
- **Search**: Discovery of photos by keyword, orientation, and color.
- **Auto-Credits**: Injects mandatory photographer attribution in Markdown/HTML.
- **Download Tracking**: Triggers required Unsplash API tracking on every download.

Built by [Dany Walls](https://danywalls.com).

# UnsplashX MCP

Model Context Protocol (MCP) server for the Unsplash API.

I got tired of AI-generated images. I wanted a fast way to use real photography in my projects and, most importantly, make sure real photographers get the credit they deserve. That's why I built **UnsplashX**.

With this MCP server, your AI agent can search, download, and insert Unsplash images directly into your files while always respecting mandatory attribution.

## Setup

To use UnsplashX in Claude Desktop, Cursor, or any MCP-compatible IDE, add this to your configuration:

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

### 1. Get Access Key
Create an app at [Unsplash Developers](https://unsplash.com/developers) to get your Access Key.

## Features
- **Search**: Discovery of photos by keyword, orientation, and color.
- **Auto-Credits**: Injects mandatory photographer attribution in Markdown/HTML.
- **Download Tracking**: Triggers required Unsplash API tracking on every download.

Built by [Dany Walls](https://danywalls.com).

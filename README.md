# UnsplashX MCP

Model Context Protocol (MCP) server for the Unsplash API. Use it to find, download, and insert images into local projects. Built for developers and AI agents (e.g. Claude, Cursor).

Created by **[Dany Walls](https://danywalls.com)** (Twitter: [@danywalls](https://twitter.com/danywalls)).

### Why I built this
I got tired of AI-generated images. I wanted a fast way to use real photography in my projects and, most importantly, make sure real photographers get the credit they deserve. That's why I built **UnsplashX**. 

With this MCP server, your AI agent can search, download, and insert Unsplash images directly into your files while always respecting mandatory attribution.

## Features
- **Search**: Discovery of photos by query, orientation, and color.
- **Auto-Credits**: Injects mandatory photographer attribution in Markdown/HTML.
- **Download Tracking**: Triggers required Unsplash API tracking on every download (`GET /photos/:id/download`).
- **CDN resizing**: Optimized URLs via built-in parameters (`w`, `fit`, etc.).

## Setup

### 1. Get Access Key
Create an app at [Unsplash Developers](https://unsplash.com/developers) to get your Access Key.

### 2. Configure Client (e.g. Claude Desktop)
Add to `claude_desktop_config.json`:

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

## Tools

- `search_photos`: Search imagery with filters.
- `insert_to_page`: Add images + attribution to local files (MD/HTML).
- `download_to_project`: Save files to a local directory.
- `get_photo`: Get technical metadata for a photo ID.

## Use Case: danywalls.com
Automate image workflows for your projects. Ask the agent: *"Find a mountain photo and insert it into post.md"*. The MCP handles search, tracking, and attribution.

## License
MIT

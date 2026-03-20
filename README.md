# UnsplashX MCP

Model Context Protocol (MCP) server for the Unsplash API. Use it to find, download, and insert images into local projects. Built for developers and AI agents (e.g. Claude, Cursor).

Created by **[Dany Walls](https://danywalls.com)** (Twitter: [@danywalls](https://twitter.com/danywalls)).

## ⚡ Quick Install

Run directly via `npx` (requires an Unsplash Access Key):

```bash
npx unsplashx <YOUR_ACCESS_KEY>
```

You can also set the key as an environment variable:
```bash
UNSPLASH_ACCESS_KEY=<YOUR_ACCESS_KEY> npx unsplashx
```

## Features
- **Search**: Find Unsplash photos by query, orientation, and color.
- **Auto-Credits**: Injects mandatory photographer attribution in Markdown/HTML.
- **Download Tracking**: Triggers `GET /photos/:id/download` per API requirements.
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
Automate image workflows for Dany's projects. Ask the agent: *"Find a mountain photo and insert it into post.md"*. The MCP handles search, tracking, and attribution.

## License
MIT

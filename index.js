#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || process.argv[2];
const API_BASE = "https://api.unsplash.com";

if (!UNSPLASH_ACCESS_KEY) {
  console.error("Error: UNSPLASH_ACCESS_KEY is required.");
  console.error("Usage: npx unsplashx <YOUR_ACCESS_KEY> or set the UNSPLASH_ACCESS_KEY environment variable.");
  process.exit(1);
}

const server = new Server(
  {
    name: "unsplash-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Helper to fetch from Unsplash
 */
async function fetchUnsplash(endpoint, params = {}) {
  const url = new URL(`${API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.append(key, value);
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      "Accept-Version": "v1",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Unsplash API error: ${error.errors?.join(", ") || response.statusText}`);
  }

  return response.json();
}

/**
 * Tool Definitions
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_photos",
        description: "Search for high-quality photos on Unsplash.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "The search term (e.g., 'office', 'nature')" },
            count: { type: "number", description: "Number of results (max 30)", default: 5 },
            orientation: { 
              type: "string", 
              enum: ["landscape", "portrait", "squarish"],
              description: "Filter by orientation" 
            },
            color: {
              type: "string",
              enum: ["black_and_white", "black", "white", "yellow", "orange", "red", "purple", "magenta", "green", "teal", "blue"],
              description: "Filter by color"
            }
          },
          required: ["query"],
        },
      },
      {
        name: "insert_to_page",
        description: "Insert a photo with mandatory attribution into a Markdown or HTML file. Automatically tracks the download.",
        inputSchema: {
          type: "object",
          properties: {
            photo_id: { type: "string", description: "The Unsplash photo ID" },
            file_path: { type: "string", description: "The absolute path to the target file" },
            alt_text: { type: "string", description: "Alt text for the image" },
            width: { type: "number", description: "Optional width in pixels" },
            format: { type: "string", enum: ["markdown", "html"], default: "markdown" }
          },
          required: ["photo_id", "file_path", "alt_text"],
        },
      },
      {
        name: "download_to_project",
        description: "Download a photo locally to your project directory. Automatically tracks the download.",
        inputSchema: {
          type: "object",
          properties: {
            photo_id: { type: "string", description: "The Unsplash photo ID" },
            destination_dir: { type: "string", description: "Absolute path to the destination directory" },
            file_name: { type: "string", description: "Desired file name (e.g., 'hero.jpg')" }
          },
          required: ["photo_id", "destination_dir", "file_name"],
        },
      },
      {
        name: "get_photo",
        description: "Get detailed information and metadata for a specific photo.",
        inputSchema: {
          type: "object",
          properties: {
            photo_id: { type: "string", description: "The Unsplash photo ID" },
          },
          required: ["photo_id"],
        },
      },
    ],
  };
});

/**
 * Tool Handlers
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "search_photos": {
        const results = await fetchUnsplash("/search/photos", {
          query: args.query,
          per_page: args.count || 5,
          orientation: args.orientation,
          color: args.color,
        });

        const photos = results.results.map(p => ({
          id: p.id,
          description: p.description || p.alt_description,
          preview_url: p.urls.small,
          photographer: p.user.name,
          attribution: `Photo by [${p.user.name}](${p.user.links.html}?utm_source=unsplashx&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplashx&utm_medium=referral)`
        }));

        return {
          content: [{ type: "text", text: JSON.stringify(photos, null, 2) }],
        };
      }

      case "insert_to_page": {
        const photo = await fetchUnsplash(`/photos/${args.photo_id}`);
        // Track download
        await fetchUnsplash(`/photos/${args.photo_id}/download`);

        const baseUrl = photo.urls.regular;
        const finalUrl = args.width ? `${baseUrl}&w=${args.width}` : baseUrl;
        const attribution = `\n\n_Photo by [${photo.user.name}](${photo.user.links.html}?utm_source=unsplashx&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplashx&utm_medium=referral)_`;
        
        let snippet = "";
        if (args.format === "html") {
          snippet = `<figure>\n  <img src="${finalUrl}" alt="${args.alt_text}" />\n  <figcaption>${attribution}</figcaption>\n</figure>`;
        } else {
          snippet = `![${args.alt_text}](${finalUrl})${attribution}`;
        }

        await fs.appendFile(args.file_path, `\n${snippet}\n`);

        return {
          content: [{ type: "text", text: `Successfully inserted image ${args.photo_id} into ${path.basename(args.file_path)} with attribution.` }],
        };
      }

      case "download_to_project": {
        const photo = await fetchUnsplash(`/photos/${args.photo_id}`);
        // Track download
        await fetchUnsplash(`/photos/${args.photo_id}/download`);

        const response = await fetch(photo.urls.full);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fullPath = path.join(args.destination_dir, args.file_name);
        await fs.mkdir(args.destination_dir, { recursive: true });
        await fs.writeFile(fullPath, buffer);

        const attribution = `Photo by [${photo.user.name}](${photo.user.links.html}?utm_source=unsplashx&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplashx&utm_medium=referral)`;

        return {
          content: [{ 
            type: "text", 
            text: `Successfully downloaded photo to ${fullPath}.\n\nREQUIRED ATTRIBUTION:\n${attribution}` 
          }],
        };
      }

      case "get_photo": {
        const photo = await fetchUnsplash(`/photos/${args.photo_id}`);
        return {
          content: [{ type: "text", text: JSON.stringify(photo, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

/**
 * Start Server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Unsplash MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

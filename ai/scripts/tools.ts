import path from "path";
import glob from "glob";
import fs from "fs";

// File operation tools
export interface Tool {
  name: string;
  description: string;
  input_schema: any;
  progress: (input: any) => string;
  execute: (...args: any[]) => Promise<string>;
}

const getFileName = (filePath: string) => {
  return path.basename(filePath).replace(/\.[^/.]+$/, "");
};

export const tools: { [key: string]: Tool } = {
  read_file: {
    name: "read_file",
    progress: (input: { filePath: string }) =>
      `Reading ${getFileName(input.filePath)}...`,
    description:
      "Read and return the contents of a file at the specified path. This tool is best used when you need to examine or analyze the contents of an existing file. It will return an error if the file doesn't exist or can't be read. The tool reads files as UTF-8 text, so it's not suitable for binary files. Use this when you need to understand what's in a file before making changes or when gathering information.",
    input_schema: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description:
            "The relative path to the file from the current working directory. For example 'src/config.json' or 'README.md'.",
        },
      },
      required: ["filePath"],
    },
    execute: async ({ filePath }: { filePath: string }) => {
      try {
        const fullPath = path.join(process.cwd(), "../", filePath);
        if (!fs.existsSync(fullPath)) {
          return `File not found: ${filePath}`;
        }
        const content = fs.readFileSync(fullPath, "utf-8");
        return content;
      } catch (error) {
        return `Error reading file: ${error}`;
      }
    },
  },
  write_file: {
    name: "write_file",
    progress: (input: { filePath: string }) => `Writing to ${input.filePath}`,
    description:
      "Create a new file or overwrite an existing file with the specified content. This tool will create any necessary parent directories if they don't exist. Use this when you need to save new content to a file or completely replace an existing file's contents. The tool writes text as UTF-8, so it's not suitable for binary data. Be cautious when using this on existing files as it will overwrite them entirely - use edit_file instead if you only need to make specific changes.",
    input_schema: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description:
            "The relative path where the file should be written, e.g. 'config/settings.json'. Parent directories will be created if they don't exist.",
        },
        content: {
          type: "string",
          description:
            "The exact text content to write to the file. This will completely replace any existing content if the file already exists.",
        },
      },
      required: ["filePath", "content"],
    },
    execute: async ({
      filePath,
      content,
    }: {
      filePath: string;
      content: string;
    }) => {
      try {
        const fullPath = path.join(process.cwd(), filePath);
        const dir = path.dirname(fullPath);
        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(fullPath, content, "utf-8");
        return `Successfully wrote to ${filePath}`;
      } catch (error) {
        return `Error writing file: ${error}`;
      }
    },
  },
  edit_file: {
    name: "edit_file",
    progress: (input: { filePath: string }) => `Editing file ${input.filePath}`,
    description:
      "Modify specific parts of an existing file while preserving the rest of its content. This tool is ideal for making targeted changes to files without affecting other parts. It performs a simple text replacement, replacing all occurrences of the search text with the replacement text. Use this when you need to update specific portions of a file while keeping the rest intact. Note that this tool uses exact string matching, not regex, so it's best for precise replacements. If the file doesn't exist or can't be modified, it will return an error.",
    input_schema: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description:
            "The relative path to the file to modify, e.g. 'src/app.ts'. The file must exist.",
        },
        searchText: {
          type: "string",
          description:
            "The exact text to find and replace in the file. This is case-sensitive and matches the text exactly as provided.",
        },
        replaceText: {
          type: "string",
          description:
            "The new text to put in place of each occurrence of the search text. The replacement is made for all occurrences.",
        },
      },
      required: ["filePath", "searchText", "replaceText"],
    },
    execute: async ({
      filePath,
      searchText,
      replaceText,
    }: {
      filePath: string;
      searchText: string;
      replaceText: string;
    }) => {
      try {
        const fullPath = path.join(process.cwd(), filePath);
        if (!fs.existsSync(fullPath)) {
          return `File not found: ${filePath}`;
        }

        let content = fs.readFileSync(fullPath, "utf-8");
        content = content.replace(searchText, replaceText);
        fs.writeFileSync(fullPath, content, "utf-8");

        return `Successfully edited ${filePath}`;
      } catch (error) {
        return `Error editing file: ${error}`;
      }
    },
  },
  list_dir: {
    name: "list_dir",
    progress: (input: { dirPath: string }) =>
      `Listing files in ${input.dirPath}`,
    description:
      "List all files and directories in the specified directory. This tool is useful for exploring the contents of a directory or verifying the existence of files. It returns a newline-separated list of all items in the directory. Use this when you need to understand the structure of a directory or find specific files. The tool does not recursively list subdirectories - it only shows immediate children of the specified directory. Returns an error if the directory doesn't exist or can't be read.",
    input_schema: {
      type: "object",
      properties: {
        dirPath: {
          type: "string",
          description:
            "The relative path to the directory to list, e.g. 'src' or 'config'. Use '.' for the current directory.",
        },
      },
      required: ["dirPath"],
    },
    execute: async ({ dirPath }: { dirPath: string }) => {
      try {
        const fullPath = path.join(process.cwd(), "../", dirPath);
        if (!fs.existsSync(fullPath)) {
          return `Directory not found: ${dirPath}`;
        }
        const items = fs.readdirSync(fullPath);
        return items.join("\n");
      } catch (error) {
        return `Error listing directory: ${error}`;
      }
    },
  },
  grep_search: {
    name: "grep_search",
    progress: (input: { pattern: string; directory: string }) =>
      `Searching for ${input.pattern} in ${input.directory}`,
    description:
      "Search for a text pattern (regular expression) across all files in a directory and its subdirectories. This tool is perfect for finding where certain patterns appear in your codebase. It recursively searches through all files, reporting which files contain matches for the regex pattern. Use this when you need to locate specific text, function names, or other patterns across multiple files. The search is case-sensitive by default and supports full JavaScript regular expressions. The tool will search all file types by default, but you can narrow the search to specific directories.",
    input_schema: {
      type: "object",
      properties: {
        pattern: {
          type: "string",
          description:
            "The regular expression pattern to search for in files. This is case-sensitive by default and supports full JavaScript regex syntax.",
        },
        directory: {
          type: "string",
          description:
            "The relative path to the directory to search in, e.g. 'src' or 'lib'. Defaults to '.' (current directory) if not specified. The search is recursive and will look in all subdirectories.",
        },
      },
      required: ["pattern"],
    },
    execute: async ({
      pattern,
      directory,
    }: {
      pattern: string;
      directory: string;
    }) => {
      try {
        const regex = new RegExp(pattern);
        const files = glob.sync("**/*", {
          cwd: "../" + directory,
          nodir: true,
        });
        let results = [];
        for (const file of files) {
          const content = fs.readFileSync(path.join(directory, file), "utf-8");
          if (regex.test(content)) {
            results.push(`${file}: contains pattern "${pattern}"`);
          }
        }
        return results.join("\n") || "No matches found";
      } catch (error) {
        return `Error searching files: ${error}`;
      }
    },
  },
};

export const toolDefinitions = Object.entries(tools).map(([key, tool]) => ({
  name: tool.name,
  description: tool.description,
  input_schema: tool.input_schema,
}));

import StyleDictionary from "style-dictionary";
import { registerTransforms } from "@tokens-studio/sd-transforms";
import fs from "fs";
import path from "path";

// Register token-studio transforms
registerTransforms(StyleDictionary);

const tokenDir = path.join(process.cwd(), "tokens");

// detect theme folders OR json theme files
const themes = fs
  .readdirSync(tokenDir)
  .filter((file) => file !== "core.json" && !file.startsWith("$"))
  .map((file) => path.parse(file).name);

export default {
  source: ["tokens/core.json", "tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "tokens-studio",
      buildPath: "src/styles/themes/",
      files: themes.map((name) => ({
        destination: `${name}.css`,
        format: "css/variables",
        options: {
          selector: `.${name}-theme`,
          outputReferences: false,
        },
        filter: (token) =>
          token.filePath.includes("/core.json") ||
          token.filePath.includes(`/tokens/${name}/`) ||
          token.filePath.endsWith(`${name}.json`),
      })),
    },

    tailwind: {
      transformGroup: "tokens-studio",
      buildPath: "src/styles/tailwind/",
      files: [
        {
          destination: "tailwind-tokens.json",
          format: "json/flat",
          options: { outputReferences: true },
        },
      ],
    },
  },
};

// support for multi similar theme files
{/** import StyleDictionary from "style-dictionary";
import { registerTransforms } from "@tokens-studio/sd-transforms";
import fs from "fs";
import path from "path";

registerTransforms(StyleDictionary);

const tokenDir = path.join(process.cwd(), "tokens");

// detect theme files (except core + $ files)
const themes = fs
  .readdirSync(tokenDir)
  .filter(
    (file) =>
      file !== "core.json" &&
      file.endsWith(".json") &&
      !file.startsWith("$")
  )
  .map((file) => path.parse(file).name);

export default {
  platforms: {
    // 💠 CSS THEMES (1 file = 1 theme)
    css: {
      transformGroup: "tokens-studio",
      buildPath: "src/styles/themes/",
      files: themes.map((name) => ({
        destination: `${name}.css`,
        format: "css/variables",
        options: {
          selector: `.${name}-theme`,
          outputReferences: false,
        },
        // 👉 load core + theme only for this file
        source: [`tokens/core.json`, `tokens/${name}.json`],
      })),
    },

    // 💠 TAILWIND TOKENS (1 flat file with all tokens)
    tailwind: {
      transformGroup: "tokens-studio",
      buildPath: "src/styles/tailwind/",
      files: [
        {
          destination: "tailwind-tokens.json",
          format: "json/flat",
          options: { outputReferences: true },
          // 👉 load only core + theme files, exclude duplicates from folders
          source: [
            "tokens/core.json",
            ...themes.map((name) => `tokens/${name}.json`),
          ],
        },
      ],
    },
  },
}; */}
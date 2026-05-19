import { defineConfig } from "vite";

const repoName = "pink-elephant-jungle-dash";

export default defineConfig(({ command }) => ({
  base: command == "build" ? `/${repoName}/` : "/",
}));

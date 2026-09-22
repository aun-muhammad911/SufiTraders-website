import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine = Object.fromEntries(
    Object.entries(env).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
  );

  return {
    define: envDefine,
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    server: { host: "::", port: 8080 },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      ignoreOutdatedRequests: true,
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        autoCodeSplitting: true,
        server: { entry: "server" },
        importProtection: {
          behavior: "error",
          client: { files: ["**/server/**"], specifiers: ["server-only"] },
        },
      }),
      ...(command === "build"
        ? [
            nitro({
              defaultPreset: "node-server",
              routeRules: {
                "/": { swr: 3600 },
                "/assets/**": {
                  headers: { "cache-control": "public, max-age=31536000, immutable" },
                },
                "/products/**": {
                  headers: { "cache-control": "public, max-age=31536000, immutable" },
                },
                "/catalogs/**": {
                  headers: { "cache-control": "public, max-age=31536000, immutable" },
                },
                "/brands/**": {
                  headers: { "cache-control": "public, max-age=31536000, immutable" },
                },
                "/fonts/**": {
                  headers: { "cache-control": "public, max-age=31536000, immutable" },
                },
              },
            }),
          ]
        : []),
      react(),
    ],
  };
});

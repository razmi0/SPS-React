import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";

// Read package.json to get version
const packageJson = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf-8"));

// https://vite.dev/config/
export default defineConfig(() => {
    const apiUrl = process.env.VITE_API_URL || "http://localhost:8000";

    return {
        build: {
            rollupOptions: {
                output: {
                    entryFileNames: `sps-[name]-v${packageJson.version}.js`,
                    chunkFileNames: `sps-[name]-v${packageJson.version}-[hash].js`,
                    assetFileNames: `sps-[name]-v${packageJson.version}.[ext]`,
                },
            },
        },
        server: {
            proxy: {
                "/api": {
                    target: apiUrl,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
        plugins: [
            tailwindcss(),
            react({
                babel: {
                    plugins: [["babel-plugin-react-compiler"]],
                },
            }),
        ],
    };
});

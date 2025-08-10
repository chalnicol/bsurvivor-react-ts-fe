// import { defineConfig } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/setupTests.ts", // or whatever your setup file is named
	},
});

import { defineConfig } from "astro/config"
import vercel from "@astrojs/vercel"
import react from "@astrojs/react"
import node from "@astrojs/node"

import sitemap from "@astrojs/sitemap"

let adapter = vercel()
const isDevelopmentServer = process.argv.includes("dev")

if (process.argv[3] === "--node" || process.argv[4] === "--node") {
	adapter = node({ mode: "standalone" })
}

export default defineConfig({
	site: "https://alexandermontillarivera.com",
	integrations: [react(), sitemap()],
	output: "server",
	adapter: adapter,
	build: {
		inlineStylesheets: "always",
	},
	vite: {
		cacheDir: `node_modules/.vite/${isDevelopmentServer ? "development" : "production"}`,
		server: {
			watch: {
				usePolling: true,
			},
		},
	},
})

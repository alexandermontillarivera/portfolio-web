import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import node from "@astrojs/node"

const isDevelopmentServer = process.argv.includes("dev")

export default defineConfig({
	site: "https://alexandermontillarivera.com",
	integrations: [react(), sitemap()],
	output: "server",
	adapter: node({ mode: "standalone" }),
	vite: {
		cacheDir: `node_modules/.vite/${isDevelopmentServer ? "development" : "production"}`,
		server: {
			watch: {
				usePolling: true,
			},
		},
	},
})

import { defineConfig } from "astro/config"
import vercel from "@astrojs/vercel"
import react from "@astrojs/react"
import node from "@astrojs/node"

import sitemap from "@astrojs/sitemap"

let adapter = vercel()

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
		server: {
			watch: {
				usePolling: true,
			},
		},
	},
})

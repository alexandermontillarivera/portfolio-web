import { defineConfig } from "astro/config"
import vercel from "@astrojs/vercel"
import react from "@astrojs/react"
import node from "@astrojs/node"

let adapter = vercel()
const isDevelopmentServer = process.argv.includes("dev")

if (process.argv[3] === "--node" || process.argv[4] === "--node") {
	adapter = node({ mode: "standalone" })
}

export default defineConfig({
	integrations: [react()],
	output: "server",
	adapter: adapter,
	vite: {
		cacheDir: `node_modules/.vite/${isDevelopmentServer ? "development" : "production"}`,
		server: {
			watch: {
				usePolling: true,
			},
		},
	},
})

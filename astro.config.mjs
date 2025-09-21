import { defineConfig } from "astro/config"
import vercel from "@astrojs/vercel"
import react from "@astrojs/react"
import node from "@astrojs/node"

let adapter = vercel()

if (process.argv[3] === "--node" || process.argv[4] === "--node") {
	adapter = node({ mode: "standalone" })
}

export default defineConfig({
	integrations: [react()],
	output: "server",
	adapter: adapter,
	vite: {
		server: {
			watch: {
				usePolling: true,
			},
		},
	},
})

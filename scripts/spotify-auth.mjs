import { createServer } from "node:http"
import { randomBytes } from "node:crypto"
import { readFile, writeFile } from "node:fs/promises"
import { spawn } from "node:child_process"

const ENV_PATH = new URL("../.env", import.meta.url)
const REDIRECT_URI = "http://127.0.0.1:4321/callback"
const TOKEN_URL = "https://accounts.spotify.com/api/token"
const SCOPES = [
	"user-read-currently-playing",
	"user-read-playback-state",
].join(" ")

const parseEnv = (source) =>
	Object.fromEntries(
		source
			.split(/\r?\n/)
			.map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/))
			.filter(Boolean)
			.map((match) => {
				const value = match[2].replace(/^(['"])(.*)\1$/, "$2")
				return [match[1], value]
			}),
	)

const setEnvValue = (source, name, value) => {
	const line = `${name}=${JSON.stringify(value)}`
	const expression = new RegExp(`^${name}=.*$`, "m")
	return expression.test(source)
		? source.replace(expression, line)
		: `${source.trimEnd()}\n${line}\n`
}

const getConfiguration = async () => {
	const source = await readFile(ENV_PATH, "utf8")
	const env = parseEnv(source)
	const clientId = env.SPOTIFY_CLIENT_ID
	const clientSecret = env.SPOTIFY_CLIENT_SECRET

	if (!clientId || !clientSecret) {
		throw new Error(
			"Completa SPOTIFY_CLIENT_ID y SPOTIFY_CLIENT_SECRET en .env antes de continuar.",
		)
	}

	return { source, env, clientId, clientSecret }
}

const exchangeToken = async ({ clientId, clientSecret, body }) => {
	const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
		"base64",
	)
	const response = await fetch(TOKEN_URL, {
		method: "POST",
		headers: {
			Authorization: `Basic ${credentials}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams(body),
	})
	const payload = await response.json().catch(() => ({}))

	if (!response.ok) {
		const detail =
			payload.error_description || payload.error || `HTTP ${response.status}`
		throw new Error(`Spotify rechazó la solicitud: ${detail}`)
	}

	return payload
}

const saveRefreshToken = async (source, refreshToken) => {
	let updated = setEnvValue(source, "SPOTIFY_AUTHORIZATION", refreshToken)
	updated = setEnvValue(
		updated,
		"SPOTIFY_REFRESH_TOKEN_ISSUED_AT",
		new Date().toISOString(),
	)
	await writeFile(ENV_PATH, updated, "utf8")
}

const openBrowser = (url) => {
	const command =
		process.platform === "win32"
			? ["rundll32.exe", ["url.dll,FileProtocolHandler", url]]
			: process.platform === "darwin"
				? ["open", [url]]
				: ["xdg-open", [url]]

	const child = spawn(command[0], command[1], {
		detached: true,
		stdio: "ignore",
	})
	child.unref()
}

const checkToken = async () => {
	const { env, clientId, clientSecret, source } = await getConfiguration()
	const refreshToken = env.SPOTIFY_AUTHORIZATION

	if (!refreshToken) {
		throw new Error(
			"No existe SPOTIFY_AUTHORIZATION. Ejecuta npm run spotify:auth.",
		)
	}

	const payload = await exchangeToken({
		clientId,
		clientSecret,
		body: {
			grant_type: "refresh_token",
			refresh_token: refreshToken,
		},
	})

	if (payload.refresh_token) {
		await saveRefreshToken(source, payload.refresh_token)
	}

	const issuedAt = Date.parse(env.SPOTIFY_REFRESH_TOKEN_ISSUED_AT)
	if (Number.isFinite(issuedAt)) {
		const ageDays = Math.floor((Date.now() - issuedAt) / 86_400_000)
		const remainingDays = Math.max(0, 180 - ageDays)
		console.log(`Refresh token válido. Aproximadamente ${remainingDays} días restantes.`)
		if (remainingDays <= 30) {
			console.warn("Renueva la autorización pronto con npm run spotify:auth.")
		}
	} else {
		console.log(
			"Refresh token válido. Falta SPOTIFY_REFRESH_TOKEN_ISSUED_AT para calcular su vencimiento.",
		)
	}
}

const authorize = async () => {
	const { source, clientId, clientSecret } = await getConfiguration()
	const state = randomBytes(24).toString("hex")
	const authorizationUrl = new URL("https://accounts.spotify.com/authorize")
	authorizationUrl.search = new URLSearchParams({
		client_id: clientId,
		response_type: "code",
		redirect_uri: REDIRECT_URI,
		scope: SCOPES,
		state,
		show_dialog: "true",
	}).toString()

	await new Promise((resolve, reject) => {
		const server = createServer(async (request, response) => {
			const requestUrl = new URL(request.url ?? "/", REDIRECT_URI)

			if (requestUrl.pathname !== "/callback") {
				response.writeHead(404).end("Not found")
				return
			}

			const code = requestUrl.searchParams.get("code")
			const returnedState = requestUrl.searchParams.get("state")
			const spotifyError = requestUrl.searchParams.get("error")

			if (spotifyError || !code || returnedState !== state) {
				response
					.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" })
					.end("No se pudo autorizar Spotify. Puedes cerrar esta ventana.")
				server.close()
				reject(new Error(spotifyError || "La respuesta de autorización no es válida."))
				return
			}

			try {
				const payload = await exchangeToken({
					clientId,
					clientSecret,
					body: {
						grant_type: "authorization_code",
						code,
						redirect_uri: REDIRECT_URI,
					},
				})

				if (!payload.refresh_token) {
					throw new Error("Spotify no devolvió un refresh token.")
				}

				await saveRefreshToken(source, payload.refresh_token)
				response
					.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
					.end(
						"<h1>Spotify conectado</h1><p>El refresh token se guardó en .env. Ya puedes cerrar esta ventana.</p>",
					)
				console.log(
					"Spotify conectado. El refresh token y su fecha se guardaron en .env.",
				)
				server.close()
				resolve()
			} catch (error) {
				response
					.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" })
					.end("Spotify rechazó el intercambio. Revisa la terminal.")
				server.close()
				reject(error)
			}
		})

		server.on("error", (error) => {
			reject(
				new Error(
					error.code === "EADDRINUSE"
						? "El puerto 4321 está ocupado. Detén npm run dev y vuelve a intentarlo."
						: error.message,
				),
			)
		})

		server.listen(4321, "127.0.0.1", () => {
			console.log("Abriendo Spotify para solicitar autorización...")
			console.log(`Si el navegador no se abre, visita:\n${authorizationUrl}`)
			openBrowser(authorizationUrl.toString())
		})
	})
}

try {
	if (process.argv.includes("--check")) {
		await checkToken()
	} else {
		await authorize()
	}
} catch (error) {
	console.error(error instanceof Error ? error.message : error)
	process.exitCode = 1
}

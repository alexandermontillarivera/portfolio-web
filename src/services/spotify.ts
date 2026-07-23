import { SPOTIFY_API_URL, SPOTIFY_ACCOUNT_API_URL } from "@/constants"
import type {
	SpotifyContentType,
	SpotifyNowPlayingResponse,
} from "@/interfaces/Spotify"
import {
	SPOTIFY_AUTHORIZATION,
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
	SPOTIFY_REFRESH_TOKEN_ISSUED_AT,
} from "@/enviroments"

const ACCESS_TOKEN_SAFETY_WINDOW_MS = 60_000

interface AccessTokenCache {
	value: string
	expiresAt: number
}

interface SpotifyTokenResponse {
	access_token?: string
	expires_in?: number
	refresh_token?: string
	error?: string
	error_description?: string
}

interface SpotifyImage {
	url?: string
}

interface SpotifyArtist {
	name?: string
}

interface SpotifyPlaybackItem {
	type?: SpotifyContentType | string
	name?: string
	external_urls?: {
		spotify?: string
	}
	artists?: SpotifyArtist[]
	album?: {
		images?: SpotifyImage[]
	}
	images?: SpotifyImage[]
	show?: {
		name?: string
	}
}

interface SpotifyPlaybackResponse {
	is_playing?: boolean
	currently_playing_type?: string
	item?: SpotifyPlaybackItem | null
}

export class SpotifyServiceError extends Error {
	constructor(
		public readonly code:
			| "configuration"
			| "reauthorization_required"
			| "token_request"
			| "playback_request",
		public readonly status: number | null,
		message: string,
	) {
		super(message)
		this.name = "SpotifyServiceError"
	}
}

let accessTokenCache: AccessTokenCache | null = null
let runtimeRefreshToken = SPOTIFY_AUTHORIZATION
let refreshTokenAgeChecked = false

const assertConfiguration = () => {
	const missing = [
		["SPOTIFY_CLIENT_ID", SPOTIFY_CLIENT_ID],
		["SPOTIFY_CLIENT_SECRET", SPOTIFY_CLIENT_SECRET],
		["SPOTIFY_AUTHORIZATION", runtimeRefreshToken],
	]
		.filter(([, value]) => !value || value === "undefined")
		.map(([name]) => name)

	if (missing.length > 0) {
		throw new SpotifyServiceError(
			"configuration",
			null,
			`Faltan variables de Spotify: ${missing.join(", ")}`,
		)
	}

	if (!refreshTokenAgeChecked) {
		refreshTokenAgeChecked = true
		const issuedAt = Date.parse(SPOTIFY_REFRESH_TOKEN_ISSUED_AT)

		if (Number.isFinite(issuedAt)) {
			const ageDays = Math.floor((Date.now() - issuedAt) / 86_400_000)

			if (ageDays >= 150) {
				console.warn(
					JSON.stringify({
						event: "spotify_refresh_token_expiring",
						ageDays,
						estimatedDaysRemaining: Math.max(0, 180 - ageDays),
					}),
				)
			}
		}
	}
}

const getAccessToken = async (forceRefresh = false): Promise<string> => {
	assertConfiguration()

	if (
		!forceRefresh &&
		accessTokenCache &&
		accessTokenCache.expiresAt > Date.now() + ACCESS_TOKEN_SAFETY_WINDOW_MS
	) {
		return accessTokenCache.value
	}

	const credentials = Buffer.from(
		`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
	).toString("base64")
	const response = await fetch(`${SPOTIFY_ACCOUNT_API_URL}/token`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${credentials}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: runtimeRefreshToken,
		}),
	})

	const payload = (await response
		.json()
		.catch(() => null)) as SpotifyTokenResponse | null

	if (!response.ok || !payload?.access_token) {
		const requiresAuthorization =
			response.status === 400 && payload?.error === "invalid_grant"

		throw new SpotifyServiceError(
			requiresAuthorization ? "reauthorization_required" : "token_request",
			response.status,
			requiresAuthorization
				? "El refresh token de Spotify expiró o fue revocado."
				: `Spotify rechazó la renovación del access token (${response.status}).`,
		)
	}

	if (payload.refresh_token) {
		runtimeRefreshToken = payload.refresh_token
	}

	accessTokenCache = {
		value: payload.access_token,
		expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000,
	}

	return payload.access_token
}

const requestPlayback = async (accessToken: string): Promise<Response> =>
	fetch(
		`${SPOTIFY_API_URL}/me/player/currently-playing?additional_types=track,episode`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	)

const normalizePlayback = (
	playback: SpotifyPlaybackResponse,
): SpotifyNowPlayingResponse => {
	const item = playback.item

	if (!playback.is_playing || !item) {
		return { isPlaying: false, item: null }
	}

	if (item.type === "episode") {
		return {
			isPlaying: true,
			item: {
				type: "episode",
				title: item.name ?? "Episodio de Spotify",
				subtitle: item.show?.name ?? "Podcast",
				url: item.external_urls?.spotify ?? "https://open.spotify.com/",
				imageUrl: item.images?.[0]?.url ?? null,
			},
		}
	}

	if (item.type !== "track") {
		return { isPlaying: false, item: null }
	}

	return {
		isPlaying: true,
		item: {
			type: "track",
			title: item.name ?? "Canción de Spotify",
			subtitle:
				item.artists
					?.map((artist) => artist.name)
					.filter(Boolean)
					.join(", ") || "Spotify",
			url: item.external_urls?.spotify ?? "https://open.spotify.com/",
			imageUrl: item.album?.images?.[0]?.url ?? null,
		},
	}
}

export const getSpotifyCurrentPlayService =
	async (): Promise<SpotifyNowPlayingResponse> => {
		let accessToken = await getAccessToken()
		let response = await requestPlayback(accessToken)

		if (response.status === 401) {
			accessTokenCache = null
			accessToken = await getAccessToken(true)
			response = await requestPlayback(accessToken)
		}

		if (response.status === 204) {
			return { isPlaying: false, item: null }
		}

		if (!response.ok) {
			throw new SpotifyServiceError(
				"playback_request",
				response.status,
				`Spotify rechazó la consulta de reproducción (${response.status}).`,
			)
		}

		const playback = (await response.json()) as SpotifyPlaybackResponse
		return normalizePlayback(playback)
	}

import type { APIRoute } from "astro"
import {
	getSpotifyCurrentPlayService,
	SpotifyServiceError,
} from "@/services/spotify"
import type { SpotifyNowPlayingResponse } from "@/interfaces/Spotify"

export const prerender = false

const idleResponse: SpotifyNowPlayingResponse = {
	isPlaying: false,
	item: null,
}

export const GET: APIRoute = async () => {
	try {
		const playback = await getSpotifyCurrentPlayService()

		return Response.json(playback, {
			headers: {
				"Cache-Control": "private, no-store, max-age=0",
			},
		})
	} catch (error) {
		if (error instanceof SpotifyServiceError) {
			console.error(
				JSON.stringify({
					event: "spotify_request_failed",
					code: error.code,
					status: error.status,
					message: error.message,
				}),
			)
		} else {
			console.error(
				JSON.stringify({
					event: "spotify_request_failed",
					code: "unexpected",
					message: error instanceof Error ? error.message : "Unknown error",
				}),
			)
		}

		return Response.json(idleResponse, {
			headers: {
				"Cache-Control": "private, no-store, max-age=0",
			},
		})
	}
}

import { SPOTIFY_API_URL, SPOTIFY_ACCOUNT_API_URL } from "@/constants"
import type SpotifyCurrentPlaying from "@/interfaces/Spotify"
import {
	SPOTIFY_AUTHORIZATION,
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
} from "@/enviroments"

export const getSpotifyCurrentPlayService =
	async (): Promise<SpotifyCurrentPlaying | null> => {
		const params = new URLSearchParams()
		params.append("grant_type", "refresh_token")
		params.append("refresh_token", SPOTIFY_AUTHORIZATION)
		params.append("client_secret", SPOTIFY_CLIENT_SECRET)
		params.append("client_id", SPOTIFY_CLIENT_ID)

		const responseToken = await fetch(`${SPOTIFY_ACCOUNT_API_URL}/token`, {
			method: "POST",
			body: params,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})

		if (!responseToken.ok) return null

		const { access_token } = await responseToken.json()

		const responseSong = await fetch(
			`${SPOTIFY_API_URL}/me/player/currently-playing`,
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			},
		)

		if (!responseSong.ok) return null

		return await responseSong.json()
	}

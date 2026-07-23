export type SpotifyContentType = "track" | "episode"

export interface SpotifyNowPlayingItem {
	type: SpotifyContentType
	title: string
	subtitle: string
	url: string
	imageUrl: string | null
}

export interface SpotifyNowPlayingResponse {
	isPlaying: boolean
	item: SpotifyNowPlayingItem | null
}

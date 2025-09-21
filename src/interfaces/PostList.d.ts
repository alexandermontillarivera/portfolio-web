export interface PostList {
	found: number
	posts: Post[]
	meta: PostListMeta
}

export interface PostListMeta {
	links: PurpleLinks
	wpcom: boolean
}

export interface PurpleLinks {
	counts: string
}

export interface Post {
	ID: number
	date: string
	title: string
	slug: string
	excerpt: string
	post_thumbnail: PostThumbnail
	tags: Record<string, PostTag>
}

export interface PostThumbnail {
	ID: number
	URL: string
	guid: string
	mime_type: string
	width: number
	height: number
}

export interface PostTag {
	ID: number
	name: string
	slug: string
	description: string
	post_count: number
}

interface PostTagMeta {
	links: PostTagMetaLinks
}

interface PostTagMetaLinks {
	self: string
	help: string
	site: string
}

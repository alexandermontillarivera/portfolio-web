export interface Post {
	ID: number
	site_ID: number
	author: Author
	date: Date
	modified: Date
	title: string
	URL: string
	short_URL: string
	content: string
	excerpt: string
	slug: string
	guid: string
	status: string
	sticky: boolean
	password: string
	parent: boolean
	type: string
	discussion: Discussion
	likes_enabled: boolean
	sharing_enabled: boolean
	like_count: number
	i_like: boolean
	is_reblogged: boolean
	is_following: boolean
	global_ID: string
	featured_image: string
	post_thumbnail: PostThumbnail
	format: string
	geo: boolean
	menu_order: number
	page_template: string
	publicize_URLs: any[]
	terms: Terms
	tags: Tags
	categories: Categor
	attachments: Attachments
	attachment_count: number
	metadata: Metadatum[]
	meta: PostMeta
	capabilities: Capabilities
	other_URLs: Attachments
}

export interface Attachments {}

export interface Author {
	ID: number
	login: string
	email: boolean
	name: string
	first_name: string
	last_name: string
	nice_name: string
	URL: string
	avatar_URL: string
	profile_URL: string
	site_ID: number
}

export interface Capabilities {
	publish_post: boolean
	delete_post: boolean
	edit_post: boolean
}

export interface PurpleLinks {
	self: string
	help: string
	site: string
}

export interface Discussion {
	comments_open: boolean
	comment_status: string
	pings_open: boolean
	ping_status: string
	comment_count: number
}

export interface PostMeta {
	links: FluffyLinks
}

export interface FluffyLinks {
	self: string
	help: string
	site: string
	replies: string
	likes: string
}

export interface Metadatum {
	id: string
	key: string
	value: string
}

export interface PostThumbnail {
	ID: number
	URL: string
	guid: string
	mime_type: string
	width: number
	height: number
}

export interface Terms {
	category: Categor
	post_tag: Tags
	post_format: Attachments
	mentions: Attachments
}

import { createClientHTTP } from "@/utils/clientHTTP"
import { WORDPRESS_SITE_URL } from "@/enviroments"
import { PostList } from "@/interfaces/PostList"
import { WORDPRESS_API_URL } from "@/constants"
import { Post } from "@/interfaces/Post"

const { GET } = createClientHTTP<{
	errors: string[]
	x: number
}>({
	baseUrl: `${WORDPRESS_API_URL}/sites/${WORDPRESS_SITE_URL}/posts`,
})

export const getPosts = async () => {
	const response = await GET<PostList>({
		query: {
			fields: "post_thumbnail,title,slug,date,ID,excerpt,tags",
		},
	})
	return response
}

export const getPostBySlug = async (slug: string) => {
	const response = await GET<Post>({
		url: `/slug:${slug}`,
	})
	return response
}

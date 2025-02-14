import axios from "axios";
import { REDDIT_BASE_URL, SUBREDDITS_PATH } from "../constans.tsx"
import { extractImageUrl } from "../utils"
import { z } from 'zod';

const SubredditSchema = z.object({
	title: z.string(),
	public_description: z.string(),
	community_icon: z.string().optional(),
	icon_img: z.string().optional(),
	url: z.string(),
	name: z.string(),
})

const RedditResponseSchema = z.object({
	data: z.object({
		children: z.array(z.object(
			{ data: SubredditSchema }
		)),
	}),
});


export async function getSubreddits(after: string) {
	return await axios.get(`${REDDIT_BASE_URL}${SUBREDDITS_PATH}?after=${after}`).then((response) => {
		const parsedData = RedditResponseSchema.parse(response.data);
		return parsedData.data.children.map((child) => ({
			title: child.data.title,
			description: child.data.public_description,
			image: extractImageUrl(child.data.community_icon && child.data.community_icon.length > 1 ? child.data.community_icon : child.data.icon_img),
			url: child.data.url,
			name: child.data.name,
		}));
	}).catch((error) => {
		console.error("getSubreddits error:", error);
		return [];
	});
}
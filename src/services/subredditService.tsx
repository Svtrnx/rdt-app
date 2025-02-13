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
})

const RedditResponseSchema = z.object({
	data: z.object({
		children: z.array(z.object(
			{ data: SubredditSchema }
		)),
	}),
});

export function getSubreddits() {
	return axios.get(`${REDDIT_BASE_URL}${SUBREDDITS_PATH}`).then((response) => {
		const parsedData = RedditResponseSchema.parse(response.data);
		return parsedData.data.children.map((child) => ({
			title: child.data.title,
			description: child.data.public_description,
			image: extractImageUrl(child.data.community_icon && child.data.community_icon.length > 1 ? child.data.community_icon : child.data.icon_img),
			url: child.data.url,
		}));
	}).catch((error) => {
		console.error("getSubreddits error:", error);
		return [];
	});
}
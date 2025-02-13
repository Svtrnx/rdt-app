import axios from "axios";
import { REDDIT_BASE_URL } from "../constans.tsx"
import { z } from 'zod';

const ThreadSchema = z.object({
	title: z.string(),
	author: z.string(),
	permalink: z.string(),
	selftext: z.string(),
});

const RedditResponseSchema = z.object({
  	data: z.object({
    	children: z.array(z.object(
			{ data: ThreadSchema }
		)),
  	}),
});

export function getThreads(subredditUrl: string) {
		return axios.get(`${REDDIT_BASE_URL}${subredditUrl}.json`).then((response) => {
			const parsedData = RedditResponseSchema.parse(response.data);

			return parsedData.data.children.map((child) => ({
				title: child.data.title,
				author: child.data.author,
				link: `${REDDIT_BASE_URL}${child.data.permalink}`,
				text: child.data.selftext,
			}));
		}).catch((error) => {
			console.error("getThreads error:", error);
			return [];
		});
}
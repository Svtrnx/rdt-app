declare global {

	interface Subreddit {
		title: string;
		description: string;
		image: string;
		url: string;
	  }
	  
	  interface Thread {
		title: string;
		author: string;
		link: string;
		text: string;
	  }

}

export {}
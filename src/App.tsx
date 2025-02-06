import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const extractImageUrl = (url: string): string => {
    return url.match(/.*?\.(png|jpg)/)?.[0] || url;
};
  

export default function App() {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [navigation, setNavigation] = useState<string>('home');
  const [subreddit, setSubreddit] = useState<string>('');


  useEffect(() => {
    axios.get("https://www.reddit.com/subreddits.json").then((response) => {
      const fetchedSubreddits: Subreddit[] = response.data.data.children.map((child: any) => ({
        title: child.data.title,
        description: child.data.public_description,
        image: extractImageUrl(child.data.icon_img) || extractImageUrl(child.data.community_icon) || "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500",
        url: child.data.url,
      }));
      setSubreddits(fetchedSubreddits);
    });
  }, []);

  const fetchThreads = (subredditUrl: string, subredditTitle: string) => {
    setThreads([]);
    setSubreddit(subredditTitle);
    setLoading(true);
    setNavigation('threads');
    axios.get(`https://www.reddit.com${subredditUrl}.json`).then((response) => {
      const fetchedThreads: Thread[] = response.data.data.children.map((child: any) => ({
        title: child.data.title,
        author: child.data.author,
        link: `https://www.reddit.com${child.data.permalink}`,
        text: child.data.selftext,
      }));
      setThreads(fetchedThreads);
      setLoading(false);
    });
  };

  return (
    <div style={{backgroundColor: '#fafafa'}} className="p-4">
        {navigation !== 'threads' ?
            <>
                <h1 className="text-xl place-self-center font-bold mb-4">Reddit Subreddits</h1>
                <div style={{backgroundColor: '#ffffff', boxShadow: "rgba(0, 0, 0, 0.04) 0px 2px 2px 0px"}} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subreddits.map((sub, index) => (
                    <div key={index} className="p-4 border-custom rounded shadow-md">
                        <img src={sub.image} alt={sub.title} className="w-12 h-12 mb-2" />
                        <h2 className="text-lg font-semibold">{sub.title}</h2>
                        <p className="text-sm text-gray-600 mb-2">{sub.description}</p>
                        <button onClick={() => fetchThreads(sub.url, sub.title)}>View Threads</button>
                    </div>
                    ))}
                </div>
            </>
        :
        <>
            {loading && <p>Loading threads...</p>}
            {threads.length > 0 && (
                <div className="mt-6">
                <button onClick={() => {setNavigation('home')}}>← Back</button>
                <h2 className="text-lg flex gap-2 place-self-center pt-3 pb-3">Subreddit <h3 className="font-bold">{subreddit}</h3>threads</h2>
                <ul className="space-y-2">
                    {threads.map((thread, index) => (
                    <li key={index} className="p-4 border-custom rounded">
                        <h3 className="text-md font-semibold">{thread.title}</h3>
                        <p className="text-sm text-gray-500">by {thread.author}</p>
                        <p className="text-sm mt-2">{thread.text}</p>
                        <a href={thread.link} target="_blank" rel="noopener noreferrer" className="text-green-500">Open Thread</a>
                    </li>
                    ))}
                </ul>
                </div>
            )}
        </>
        }
    </div>
  );
}

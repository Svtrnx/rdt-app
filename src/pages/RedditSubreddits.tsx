import { useState, useEffect } from "react";
import { getSubreddits } from "../services/subredditService.tsx";
import { getThreads } from "../services/threadService.tsx";
import { Subreddit } from "../types/subredditTypes.ts";
import { Thread } from "../types/threadTypes.ts";


export default function RedditSubreddits() {

	const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [navigation, setNavigation] = useState<string>('home');
    const [subredditName, setSubredditName] = useState<string>('');
    const [subredditUrl, setSubredditUrl] = useState<string>('');
    const [afterName, setAfterName] = useState('')
    const [afterNameThreads, setAfterNameThreads] = useState('')

    const infiniteScroll = async () => {
        if (loading) return;
        setLoading(true)
        try {
            if (navigation === 'home') {
                const newSubreddits = await getSubreddits(afterName)
                if (newSubreddits.length > 0) {
                    setSubreddits((prev) => [...prev, ...newSubreddits])
                    setAfterName(newSubreddits[newSubreddits.length - 1].name)
                }
            }
            else {
                const fetchedThreads = await getThreads(subredditUrl, afterNameThreads);
                if (fetchedThreads.length > 0) {
                    setThreads((prev) => [...prev, ...fetchedThreads])
                    setAfterNameThreads(fetchedThreads[fetchedThreads.length - 1].name)
                }
            }
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        infiniteScroll()
    }, []);

    useEffect(() => {
        const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            infiniteScroll()
            }
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [afterName, infiniteScroll])
    

    const fetchThreads = async (subredditUrl: string, subredditTitle: string) => {
        setThreads([]);
        setSubredditName(subredditTitle);
        setSubredditUrl(subredditUrl);
        setLoading(true);
        setNavigation('threads');
        const fetchedThreads = await getThreads(subredditUrl, afterNameThreads);
        setThreads(fetchedThreads);
        setAfterNameThreads(fetchedThreads[fetchedThreads.length - 1].name)
        setLoading(false);

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
                    {subreddits && subreddits.length > 0 && loading ? 
                    <div style={{display: 'grid', justifyItems: 'center', marginTop: '30px'}}>
                        <span className="loader2"></span>
                    </div>
                    : null }
                </>
            :
            <>
                {loading && <span className="loader"></span>}
                {threads.length > 0 && (
                    <div className="mt-6">
                        <button className="ml-4" onClick={() => {setNavigation('home'); setAfterName('')}}>← Back</button>
                        <h2 className="text-lg flex gap-2 place-self-center pt-3 pb-3">Subreddit <span className="font-bold">{subredditName}</span>threads</h2>
                        <ul className="space-y-2">
                            {threads.map((thread, index) => (
                            <li key={index} className="p-4 ml-4 border-custom rounded">
                                <h3 className="text-md font-semibold">{thread.title}</h3>
                                <p className="text-sm text-gray-500">by {thread.author}</p>
                                <p className="text-sm mt-2">{thread.text}</p>
                                <a href={thread.link} target="_blank" rel="noopener noreferrer" className="text-green-500">Open Thread</a>
                            </li>
                            ))}
                        </ul>
                        {threads && threads.length > 0 && loading ? 
                            <div style={{display: 'grid', justifyItems: 'center', marginTop: '30px'}}>
                                <span className="loader2"></span>
                            </div>
                        : null }
                    </div>
                    

                )}
            </>
            }
        </div>
    );

}
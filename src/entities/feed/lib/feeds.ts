import { IFeed, TFeedFilter } from "entities/feed"
import { useEffect, useState } from "react"

export const useFilterFeeds = (
    feeds: {[key: string]: IFeed}, 
    type: TFeedFilter
) => {
    const [filteredFeeds, setFilteredFeeds] = useState<{[key: string]: IFeed}>(feeds);

    useEffect(() => {
        switch (type) {
            case "music":
                setFilteredFeeds(Object.fromEntries(
                    Object.entries(feeds).filter(
                        ([, feed]) => 
                            feed.items[0].type === "playlist" ||
                            feed.items[0].type === "album" ||
                            feed.items[0].type === "artist"
                    )
                ))
                break;
            case "podcasts":
                setFilteredFeeds(Object.fromEntries(
                    Object.entries(feeds).filter(
                        ([, feed]) => 
                            feed.items[0].type === "show" ||
                            feed.items[0].type === "episode"
                    )
                ))
                break;
            default:
                setFilteredFeeds(feeds);
                break;
        }
    }, [type, feeds]);

    return { filteredFeeds };
}
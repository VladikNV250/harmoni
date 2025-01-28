export { default as feedReducer} from "./model/feedSlice";
export { feedSlice } from "./model/feedSlice";

export type { IFeed } from "./model/types";

export { 
    selectFeeds,
    selectFeedLoading,
    selectFeedError
} from "./model/selectors";

export { FeedList } from "./ui/FeedList/FeedList";
export { FeedHeader } from "./ui/FeedHeader/FeedHeader";
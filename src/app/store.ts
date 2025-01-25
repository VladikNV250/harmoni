import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { albumReducer } from "entities/album";
import { artistReducer } from "entities/artist";
import { audiobookReducer } from "entities/audiobook";
import { feedReducer } from "entities/feed";
import { playlistReducer } from "entities/playlist";
import { podcastReducer } from "entities/podcast";
import { userReducer } from "entities/user";
import { 
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer, 
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE
} from "redux-persist";
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
    feed: feedReducer,    
    playlist: playlistReducer,
    artist: artistReducer,
    audiobook: audiobookReducer,
    podcast: podcastReducer,
    album: albumReducer,
    user: userReducer,
})

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ["feed"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
})

export const persistor = persistStore(store)
export default store

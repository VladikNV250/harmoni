import { 
    combineReducers, 
    configureStore 
} from "@reduxjs/toolkit";
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
import { playerReducer } from "widgets/Player";
import { deviceReducer } from "features/device";
import { queueReducer } from "features/queue";
import { libraryReducer } from "features/library";
import { searchReducer } from "features/search";
import { feedReducer } from "entities/feed";
import { userReducer } from "entities/user";

const rootReducer = combineReducers({
    feed: feedReducer,    
    user: userReducer,
    queue: queueReducer,
    device: deviceReducer,
    player: playerReducer,
    library: libraryReducer,
    search: searchReducer,
})

/**
 * Configuration for redux-persist
 * Needed for storing parts of state between updating pages.
 */
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ["feed", "library"], // these slices will be stored in localStorage
}

/** Wrap our root reducer in persist reducer. */
const persistedReducer = persistReducer(persistConfig, rootReducer)

/** Redux store with custom middleware, which remove serializableCheck for redux-persist actions. */
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
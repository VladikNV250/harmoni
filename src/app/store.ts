import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { feedReducer } from "entities/feed";
import { userReducer } from "entities/user";
import { deviceReducer } from "features/device";
import { queueReducer } from "features/queue";
import { playerReducer } from "widgets/Player";
import { libraryReducer } from "features/library";
import { searchReducer } from "features/search";
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
    user: userReducer,
    queue: queueReducer,
    device: deviceReducer,
    player: playerReducer,
    library: libraryReducer,
    search: searchReducer,
})

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ["feed", "library"],
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
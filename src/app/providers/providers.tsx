import store, { persistor } from "app/store";
import { ThemeProvider } from "entities/theme";
import { PlaybackProvider } from "entities/playback";
import { FC, useCallback } from "react";
import { Provider } from "react-redux";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import { PersistGate } from "redux-persist/integration/react";
import { currentToken } from "shared/api/authorization";

interface IProviders {
    children: JSX.Element;
}

type getOAuthTokenCallback = (token: string) => void

export const Providers: FC<IProviders> = ({ children }) => {
    const getOAuthToken = useCallback((callback: getOAuthTokenCallback) => {
        callback(currentToken.access_token ?? "")
    }, [])

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider>
                    <WebPlaybackSDK
                        initialDeviceName="Harmoni App Player"
                        getOAuthToken={getOAuthToken}
                        initialVolume={0.5}
                        connectOnInitialized={true}>
                        <PlaybackProvider>
                            {children}
                        </PlaybackProvider>
                    </WebPlaybackSDK>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    )
}
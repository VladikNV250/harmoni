import { FC } from "react";
import {
    BrowserRouter,
    Route,
    Routes
} from "react-router";
import { Layout } from "app/layout";
import { Callback } from "pages/Callback";
import { HomePage } from "pages/HomePage";
import { LibraryPage } from "pages/LibraryPage";
import { LoginPage } from "pages/LoginPage";
import { ProfilePage } from "pages/ProfilePage";
import { SearchPage } from "pages/SearchPage";
import { PlaylistPage } from "pages/PlaylistPage";
import { AlbumPage } from "pages/AlbumPage";
import { ArtistPage } from "pages/ArtistPage";
import { ShowPage } from "pages/ShowPage";
import { EpisodePage } from "pages/EpisodePage";
import { FolderPage } from "pages/FolderPage";
import { NotFoundPage } from "pages/NotFoundPage";
import { useTheme } from "entities/theme";
import { ProtectedRoute } from "./ProtectedRoute";
import clsx from "clsx";

/**
 * @component AppRouter
 * @description
 * Defines the app's routing structure using `react-router`.
 * Protects routes with `ProtectedRoute` and applies the current theme.
 */
export const AppRouter: FC = () => {
    const { theme } = useTheme();

    return (
        <div className={clsx("app", theme)}>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Layout />}
                    >
                        <Route index element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                        <Route
                            path="search"
                            element={<ProtectedRoute><SearchPage /></ProtectedRoute>}
                        />
                        <Route
                            path="library"
                            element={<ProtectedRoute><LibraryPage /></ProtectedRoute>}
                        />
                        <Route
                            path="profile"
                            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
                        />
                        <Route
                            path="playlists/:id"
                            element={<ProtectedRoute><PlaylistPage /></ProtectedRoute>}
                        />
                        <Route
                            path="albums/:id"
                            element={<ProtectedRoute><AlbumPage /></ProtectedRoute>}
                        />
                        <Route
                            path="artists/:id"
                            element={<ProtectedRoute><ArtistPage /></ProtectedRoute>}
                        />
                        <Route
                            path="shows/:id"
                            element={<ProtectedRoute><ShowPage /></ProtectedRoute>}
                        />
                        <Route
                            path="episodes/:id"
                            element={<ProtectedRoute><EpisodePage /></ProtectedRoute>}
                        />
                        <Route
                            path="folders/:id"
                            element={<ProtectedRoute><FolderPage /></ProtectedRoute>}
                        />
                        <Route
                            path="categories/:id"
                            element={<ProtectedRoute><NotFoundPage /></ProtectedRoute>}
                        />
                        <Route
                            path="callback"
                            element={<Callback />}
                        />
                    </Route>
                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />
                    <Route
                        path="/*"
                        element={<NotFoundPage />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    )
}
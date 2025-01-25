import { Layout } from "app/layout";
import clsx from "clsx";
import { useTheme } from "entities/theme";
import { Callback } from "pages/Callback";
import { HomePage } from "pages/HomePage";
import { LibraryPage } from "pages/LibraryPage";
import { LoginPage } from "pages/LoginPage";
import { ProfilePage } from "pages/ProfilePage";
import { SearchPage } from "pages/SearchPage";
import { FC } from "react";
import { 
    BrowserRouter,
    Route, 
    Routes
} from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter: FC = () => {
    const { theme } = useTheme();

    
    return (
        <div className={clsx("app", theme)}>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Layout />}
                        /*errorElement={<Fallback />} */>
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
                            path="callback"
                            element={<Callback />}
                        />
                    </Route>
                    <Route  
                        path="/login"
                        element={<LoginPage />}
                    />
                </Routes>
            </BrowserRouter>            
        </div>
    )
}
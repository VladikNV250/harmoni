import {
    FC,
    Suspense,
    useEffect
} from "react";
import { useNavigate } from "react-router";
import { currentToken } from "shared/api/authorization";

interface IProtectedRoute {
    children: JSX.Element[] | JSX.Element;
}

/**
 * @description 
 * A higher-order component that restricts access to its children based on the presence of a valid access token.
 * Redirects unauthenticated users to the login page.
 */

export const ProtectedRoute: FC<IProtectedRoute> = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentToken.access_token) navigate("/login", { replace: true });
    }, [navigate])

    return currentToken ?
        <Suspense>
            {children}
        </Suspense>
        : null;
}
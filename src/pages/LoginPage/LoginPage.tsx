import { FC } from "react";
import { getAuthURL } from "shared/api/authorization";
import { Title } from "shared/ui";
import "./LoginPage.scss";

export const LoginPage: FC = () => {
    const handleAuthorize = async () => {
        const authURL = await getAuthURL();
        window.location.href = authURL;
    }
    
    return (
        <div className="login">
            <Title className="login-title">You don't authorize to App</Title>
            <button className="button" onClick={handleAuthorize}>
                Log In
            </button>
        </div>
    )
}
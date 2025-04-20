import { FC, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { currentToken } from "shared/api/authorization";

export const Callback: FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    useEffect(() => {
        (async () => {
            const authCode = searchParams.get("code");
            if (authCode) {
                try {
                    const response = await currentToken.fetchToken(authCode);
                    currentToken.saveToken(response);
                } catch (e) {
                    console.error(e);   
                } finally {
                    navigate("/");
                }
            }
        })()
    }, [searchParams, navigate]);
    
    return null;
}
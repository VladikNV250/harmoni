import axios from "axios";
import { BASIC_AUTH_URL, CLIENT_ID, REDIRECT_URI } from "shared/consts";

class Token {
    private readonly apiTokenUrl: string = `${BASIC_AUTH_URL}/api/token`;

    public get access_token() { return localStorage.getItem("access_token") || null };
    public get refresh_token() { return localStorage.getItem("refresh_token") || null };
    public get expires_in() { return localStorage.getItem("refresh_in") || null };
    public get expires() { return localStorage.getItem("expires") || null };

    public saveToken(
        response: {
            access_token: string | null,
            refresh_token: string | null,
            expires_in: number | null,
        }
    ) {
        const { access_token, refresh_token, expires_in } = response;

        localStorage.setItem("access_token", access_token || "");
        localStorage.setItem("refresh_token", refresh_token || "");
        localStorage.setItem("expires_in", `${expires_in}` || "");

        const now = new Date();
        const expiry = new Date(now.getTime() + (((expires_in ?? 60) - 60) * 1000)); // for more security expire date is 59 minutes, not 60
        localStorage.setItem("expires", expiry.toString());
    }

    public async fetchToken(code: string) {
        const codeVerifier = localStorage.getItem("code_verifier");
        
        const response = await axios.post(
            this.apiTokenUrl, 
            {
                grant_type: "authorization_code",
                code: code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                code_verifier: codeVerifier,
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        );

        return response.data;
    }

    public async updateToken() {
        const expire_date = new Date(this.expires || "");

        if (Date.now() > expire_date.getTime()) {
            try {
                const response = await this.refreshToken();
                this.saveToken(response);
            } catch (e) {
                console.error(e);
            }
        }
    }

    private async refreshToken() {
        const response = await axios.post(
            this.apiTokenUrl,
            {
                grant_type: "refresh_token",
                refresh_token: this.refresh_token,
                client_id: CLIENT_ID,
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        );

        return response.data;
    }
}

export const currentToken = new Token();
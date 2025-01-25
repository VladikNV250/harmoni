//** For more information look https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow */
export const getCodeVerifier = (): string => { 
    const generateRandomString = (length: number) => {
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }
    
    const codeVerifier = generateRandomString(64); 
    return codeVerifier;
}
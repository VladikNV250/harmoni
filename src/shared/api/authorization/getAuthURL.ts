import { BASIC_AUTH_URL, CLIENT_ID, REDIRECT_URI } from "shared/consts";
import { getCodeChallenge } from "./getCodeChallenge";
import { getCodeVerifier } from "./getCodeVerifier"

export const getAuthURL = async (): Promise<string> => {
    const codeVerifier = getCodeVerifier();
    localStorage.setItem("code_verifier", codeVerifier);

    const codeChallenge = await getCodeChallenge(codeVerifier);
    const AUTH_URL = new URL(`${BASIC_AUTH_URL}/authorize`);

    let scopes = "";
    // scopes += "ugc-image-upload "; // Add Custom Playlist Cover Image
    scopes += "user-read-playback-state "; // Read your currently playing content and Spotify Connect devices information.
    scopes += "user-modify-playback-state "; // Control playback on your Spotify clients and Spotify Connect devices.
    scopes += "user-read-currently-playing "; // Get the User's Currently Playing Track and Queue
    scopes += "streaming "; // Control playback of a Spotify track. Web Playback SDK. Need Premium Account of User
    scopes += "playlist-read-private "; // Access your private playlists.
    scopes += "playlist-read-collaborative "; // Access your collaborative playlists.
    scopes += "playlist-modify-private "; // Manage your private playlists.
    scopes += "playlist-modify-public "; // Manage your public playlists.
    scopes += "user-follow-modify "; // Manage who you are following.
    scopes += "user-follow-read "; // Access your followers and who you are following.
    scopes += "user-read-playback-position "; // Get an Episodes and Shows
    scopes += "user-top-read "; // Read your top artists and content.
    // scopes += "user-read-recently-played "; // Access your recently played items.
    scopes += "user-library-modify "; // Manage your saved content.
    scopes += "user-library-read "; //	Access your saved content.
    scopes += "user-read-email "; // Get your real email address.
    scopes += "user-read-private "; // Access your subscription details.
    // scopes += "user-soa-link "; // register user in dashboard?

    const params = new URLSearchParams({
        response_type: "code",
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: scopes,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
    })

    AUTH_URL.search = params.toString();
    return AUTH_URL.toString();
}
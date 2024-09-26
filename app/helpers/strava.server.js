export const KV_EXPIRY_STRAVA = process.env.KV_EXPIRY_STRAVA
    ? parseInt(process.env.KV_EXPIRY_STRAVA)
    : 60 * 60 * 24 * 30 //one month


//const STRAVA_AUTHORISE_URL = "https://www.strava.com/oauth/authorize";
const STRAVA_AUTHORISE_URL = "https://www.strava.com/oauth/authorize";
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
//  getStravaAuthoriseURL 
//  given redirect url and scope, returns the url to authorise the app
//  @param {string} redirect_uri - the redirect uri to use
//  @param {string} scope - the scope of the authorisation
//  @returns {string} - the url to authorise the app
export function getStravaAuthoriseURL(redirect_uri, scope="activity:read,read") {
    const client_id = process.env.STRAVA_CLIENT_ID? process.env.STRAVA_CLIENT_ID : "";
    if (client_id === "") {
        throw new Response("No client id found in .env", {status: 500});
    }
    
    const params = {client_id,
        redirect_uri,
        response_type:"code",
        approval_prompt:"auto",
        scope
        };
    const queryString = new URLSearchParams(params).toString();
    return `${STRAVA_AUTHORISE_URL}?${queryString}`;
}

export async function getStravaToken(code,refresh=false) {

    const formData = new FormData();
    formData.append("client_id", process.env.STRAVA_CLIENT_ID);
    formData.append("client_secret", process.env.STRAVA_CLIENT_SECRET);
    if (refresh) {
        formData.append("grant_type", "refresh_token");
        formData.append("refresh_token", code);
    } else {
        formData.append("code", code);
        formData.append("grant_type", "authorization_code");
    }
    
    return await fetchToken(formData);
}

export async function fetchToken(formData) {
    const response = await fetch(STRAVA_TOKEN_URL, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        return new Response("Error during Strava auth",{status:500})
    }
    const json = await response.json();
    return json;
}
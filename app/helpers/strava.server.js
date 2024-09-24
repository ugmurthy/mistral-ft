
const STRAVA_AUTHORISE_URL = "https://www.strava.com/oauth/authorize";

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

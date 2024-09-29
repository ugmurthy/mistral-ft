export const KV_EXPIRY_STRAVA = process.env.KV_EXPIRY_STRAVA
    ? parseInt(process.env.KV_EXPIRY_STRAVA)
    : 60 * 60 * 24 * 30 //one month


//const STRAVA_AUTHORISE_URL = "https://www.strava.com/oauth/authorize";
const STRAVA_AUTHORISE_URL = "https://www.strava.com/oauth/authorize";
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
export const STRAVA_SUBSCRIPTION_URL = "https://www.strava.com/api/v3/push_subscriptions";
const STRAVA_CALLBACK_URL = "https://rungenie/strava_callback";
export const STRAVA_VERIFY_TOKEN ="strava_rungenie_007"
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

// STEPS to subscribe to Strava webhooks
// 1. Create a Subscripton and POST to strava subscription
// 2. Strava will send a GET request to the callback url with a 'hub.verify_token' and 'hub.challenge' parameter
// 3. Verify the hub.verify_token (same as one that was sent as verify_tokne) parameter and respond with the hub.challenge parameter
// 4. the App should return the hub.challenge along with header = application/json as a POST request
// 5. Strava will send a POST request to the callback url with the subscription id and latest_timestamp
// 6. Store the subscription id and latest_timestamp in a database

// Create Strava Subscription
// @param {string} client_id - the client id of the app
// @param {string} client_secret - the client secret of the app
// @param {string} callback_url - the callback url to use
// @param {string} verify_token - the verify token to use
export async function createStravaSubscription(
    client_id=process.env.STRAVA_CLIENT_ID, 
    client_secret=process.env.STRAVA_CLIENT_SECRET, 
    callback_url=STRAVA_CALLBACK_URL,
    verify_token=STRAVA_VERIFY_TOKEN) {

        const formData = new FormData();
        formData.append("client_id", client_id);
        formData.append("client_secret", client_secret);
        formData.append("callback_url", callback_url);
        formData.append("verify_token", verify_token);

    const response = await fetch(
       STRAVA_SUBSCRIPTION_URL,
        {
            method: "POST",
            body: formData,
        } );
    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        console.log(response.statusText,response.status);
        return new Response(`Error during Strava subscription:${response.statusText}`,{status:500})    
    }
}

    
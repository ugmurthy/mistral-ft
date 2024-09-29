import { getFormData, getHeaders,getSearchParamsAsJson,isFormData } from "~/helpers/webUtils.server";
import { STRAVA_VERIFY_TOKEN } from "~/helpers/strava.server";
import { method } from "lodash";

// RESOURCE ROUTE called by strava on creating a subscription - we need to respond with hub.challenge
// status=200 within 2 secs

export async function action({request}) {
const ret_data = isFormData(request)?await getFormData(request):await request.json();
console.log("/strava_callback EVENT: ",JSON.stringify(ret_data));
console.log("/strava_callback EVENT: ",request.status);

return new Response("Got it",{status:200})
// check if hub.verify_token is correct same as ours
// const verified = ret_data?.hub_verify_token? ret_data.hub_verify_token === STRAVA_VERIFY_TOKEN:false;
// if (!verified) {
//     return new Response("Invalid verify token",{status:401});
// }
// const formData = new FormData();
// formData.append("hub.challenge",ret_data.hub_challenge);

// const headers = {
//     "Content-Type":  "application/json"
// }

//     return new Response(formData,{headers,status:200});
}
/*
On createSubstription - Strava sends a GET request to callback URL in the the create
subscription with hub.challenge, hub.mode (always subscribe),
hub.verify_token (the originial token sent by app during create subscription)
verify the token corresponds to one you have sent and respond with hub.challenge
keeping things simple:  passing whole params when it isn't necessary

*/
export async function loader({request}) {   
    const params = getSearchParamsAsJson(request);
    console.log("/strava_callback loader: ",JSON.stringify(params));
    // check if hub.verify_token is correct same as ours
    const verify_token = params["hub.verify_token"];
    if (!verify_token || (verify_token !== STRAVA_VERIFY_TOKEN)) {
        console.log("/strava_callback loader: invalid verify_token",verify_token);
        return new Response("Invalid verify token",{status:401});
    }

    return new Response(JSON.stringify({params}),{status:200,headers:{"Content-Type":"application/json"}});
}
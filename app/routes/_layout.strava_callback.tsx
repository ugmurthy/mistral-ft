import { getFormData, getHeaders,getSearchParamsAsJson,isFormData } from "~/helpers/webUtils.server";
import { STRAVA_VERIFY_TOKEN } from "~/helpers/strava.server";
import { getKV, setKV ,KV_EXPIRY_STRAVA} from "../module/kv.server";
//import { method } from "lodash";

// RESOURCE ROUTE called by strava on creating a subscription - we need to respond with hub.challenge
// status=200 within 2 secs
// it is not gauranteed that the user is logged in while this callback happens
// hence using athlete_id to identify the user
// in case of callback the key for athlete id is owner_id
// callback json is stored as KV with athlete_id as key.
// also it append to exisiting callback data if any

export async function action({request}) {
const ret_data = isFormData(request)?await getFormData(request):await request.json();
console.log("/strava_callback EVENT: ",JSON.stringify(ret_data));
console.log("/strava_callback EVENT: ",request.status);

// store data with key athelete_id
const athlete_id = ret_data["owner_id"];
if (athlete_id) {
    const prev_data = await getKV(athlete_id);
    // ensure we have last 7 callback info - trim if more
    const new_data = prev_data?[...prev_data,ret_data]:[ret_data];
    const excess = new_data.length - 7;
    if (excess > 0) {
        new_data.splice(excess);
    }
    const result=await setKV(athlete_id,new_data,KV_EXPIRY_STRAVA);

return new Response("Got it",{status:200})

}
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


    return new Response(JSON.stringify(params),{status:200,headers:{"Content-Type":"application/json"}});
}
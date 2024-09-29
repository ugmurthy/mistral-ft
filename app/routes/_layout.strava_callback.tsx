import { getFormData, getHeaders,getSearchParamsAsJson,isFormData } from "~/helpers/webUtils.server";
import { STRAVA_VERIFY_TOKEN } from "~/helpers/strava.server";
import { method } from "lodash";

// RESOURCE ROUTE called by strava on creating a subscription - we need to respond with hub.challenge
// status=200 within 2 secs

export async function action({request}) {
const ret_data = isFormData(request)?await getFormData(request):await request.json();
console.log("/strava_callback action: ",JSON.stringify(ret_data));

// check if hub.verify_token is correct same as ours
const verified = ret_data?.hub_verify_token? ret_data.hub_verify_token === STRAVA_VERIFY_TOKEN:false;
if (!verified) {
    return new Response("Invalid verify token",{status:401});
}
const formData = new FormData();
formData.append("hub.challenge",ret_data.hub_challenge);

const headers = {
    "Content-Type":  "application/json"
}

    return new Response(formData,{headers,status:200});
}

export async function loader({request}) {   
    const params = getSearchParamsAsJson(request);
    console.log("/strava_callback loader: ",JSON.stringify(params));
    return new Response(JSON.stringify(params),{status:200,headers:{"Content-Type":"application/json"}});
}
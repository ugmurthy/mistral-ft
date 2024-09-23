import { redirect } from "@remix-run/node";
import { getFormData, getHeaders,getSearchParamsAsJson,isFormData,isJson } from "~/helpers/webUtils.server";

// RESOURCE ROUTE
export async function action({request}) {
const ret_data = isFormData(request)?await getFormData(request):await request.json();
const headers = getHeaders(request);
console.log("/strava_callback : ",JSON.stringify(headers));

console.log("/strava_callback : ",JSON.stringify(ret_data));
//process the callback here
    return new Response("Got it",{status:200});
}

export async function loader({request}) {   
    const params = getSearchParamsAsJson(request);
    console.log("/strava_callback : ",JSON.stringify(params));
    return new Response(JSON.stringify(params),{status:200,headers:{"Content-Type":"application/json"}});
}
import { redirect } from "@remix-run/node";
import { getFormData, getHeaders,isFormData,isJson } from "~/helpers/webUtils.server";

// RESOURCE ROUTE
export async function action({request}) {
const ret_data = isFormData(request)?await getFormData(request):await request.json();
const headers = getHeaders(request);
console.log("/strava_callback : ",JSON.stringify(headers));

console.log("/strava_callback : ",JSON.stringify(ret_data));
//process the callback here
    return new Response("Got it",{status:200});
}

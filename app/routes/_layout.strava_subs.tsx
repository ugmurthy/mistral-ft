// GET or GET & DELETE a subscription 
// @TODO : if no subs then CREATE if param is create=1
// RESOURCE ROUTE
// /strava_subs?del=1   // will GET and Delete a subs if exists
// /strava_subs?create=1 // will GET and Create a subs if no subs exists
import { requireUserId } from "~/module/session/session.server";
import {  STRAVA_SUBSCRIPTION_URL} from "~/helpers/strava.server";
import { getSearchParamsAsJson } from "~/helpers/webUtils.server";
//import { get } from "lodash";
// RESOURCE ROUTE
export async function loader({request}) {
    const userId = await requireUserId(request);
    let {del} =  getSearchParamsAsJson(request);
    console.log("/strava_subs : ",del)
    del = del?true:false;

    const client_id = process.env.STRAVA_CLIENT_ID;
    const client_secret = process.env.STRAVA_CLIENT_SECRET;
    const url = `${STRAVA_SUBSCRIPTION_URL}?client_id=${client_id}&client_secret=${client_secret}`

    const response = await fetch(url);
    let ret_data = await response.json();
    const id = ret_data[0]?.id;
    const no_subs = ret_data.length === 0;

    console.log("/strava_subs : Deleting subs ",id, del, ret_data)
    // DELETE if requested
    if (del && id) {
        const del_url = `${STRAVA_SUBSCRIPTION_URL}/${id}?client_id=${client_id}&client_secret=${client_secret}`
        console.log("/strava_subs delete ",del_url)
        const del_response = await fetch(del_url, {method: 'DELETE'});
        ret_data = await del_response.json();
    }
    return ret_data;
}
    


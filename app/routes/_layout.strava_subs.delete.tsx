// GET & DELETE a subscription

import { requireUserId } from "~/module/session/session.server";
import {  STRAVA_SUBSCRIPTION_URL} from "~/helpers/strava.server";

// RESOURCE ROUTE
export async function loader({request}) {
    const userId = await requireUserId(request);
    // DELETE a subscription
    
    const client_id = process.env.STRAVA_CLIENT_ID;
    const client_secret = process.env.STRAVA_CLIENT_SECRET;
    const url = `${STRAVA_SUBSCRIPTION_URL}?client_id=${client_id}&client_secret=${client_secret}`

    const response = await fetch(url);
    let ret_data = await response.json();
    const id = ret_data[0]?.id;
    
    if (id) {
        const del_url = `${STRAVA_SUBSCRIPTION_URL}/${id}?client_id=${client_id}&client_secret=${client_secret}`
        console.log("/strava_subs delete ",del_url)
        const del_response = await fetch(del_url, {method: 'DELETE'});
        if (del_response.status !== 204) {
            console.log("Error deleting subscription", del_response.status, del_response.statusText);
            return {status:del_response.status, statusText:del_response.statusText};
        }
        return ret_data;
    }
    return ret_data;
}
    


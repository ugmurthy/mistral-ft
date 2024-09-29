
import { requireUserId } from "~/module/session/session.server";
import {  STRAVA_SUBSCRIPTION_URL} from "~/helpers/strava.server";
//import { get } from "lodash";
// RESOURCE ROUTE
export async function loader({request}) {
    const userId = await requireUserId(request);
    
    const client_id = process.env.STRAVA_CLIENT_ID;
    const client_secret = process.env.STRAVA_CLIENT_SECRET;
    const url = `${STRAVA_SUBSCRIPTION_URL}?client_id=${client_id}&client_secret=${client_secret}`

    const response = await fetch(url);
    const ret_data = await response.json();

    return ret_data;
}
    


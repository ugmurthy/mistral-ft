// GET or GET & DELETE a subscription

import { requireUserId } from "~/module/session/session.server";
import {  STRAVA_SUBSCRIPTION_URL} from "~/helpers/strava.server";
import { getSearchParamsAsJson } from "~/helpers/webUtils.server";
//import { get } from "lodash";
// RESOURCE ROUTE
export async function loader({request}) {
    const userId = await requireUserId(request);
    const params = await getSearchParamsAsJson(request);
    const del = params.del?true:false;

    const client_id = process.env.STRAVA_CLIENT_ID;
    const client_secret = process.env.STRAVA_CLIENT_SECRET;
    const url = `${STRAVA_SUBSCRIPTION_URL}?client_id=${client_id}&client_secret=${client_secret}`

    const response = await fetch(url);
    let ret_data = await response.json();
    // DELETE if requested
    if (del) {
      
      const id = ret_data?.id ? ret_data.id : null;
      if (id) {
        console.log("/strava_subs : Deleting subs ",id)
        const del_url = `${STRAVA_SUBSCRIPTION_URL}/${id}`
        const formData = new FormData();
        formData.append('client_id', client_id);
        formData.append('client_secret', client_secret);
        const del_response = await fetch(del_url, {method: 'DELETE',body:formData});
        ret_data = await del_response.json();
      }
    }
    return ret_data;
}
    


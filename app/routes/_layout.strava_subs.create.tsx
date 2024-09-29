//  CREATE STRAVA SUBSCRIPTION

import { requireUserId } from "~/module/session/session.server";
import {  STRAVA_SUBSCRIPTION_URL} from "~/helpers/strava.server";
import { getSearchParamsAsJson } from "~/helpers/webUtils.server";

// RESOURCE ROUTE
export async function loader({request}) {
    const userId = await requireUserId(request);
    console.log("/strava_subs/create : ")
    const ret_data = await createStravaSubscription();
    return ret_data;
}
    


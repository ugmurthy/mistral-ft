//  CREATE STRAVA SUBSCRIPTION

import { requireUserId } from "~/module/session/session.server";
import {  createStravaSubscription} from "~/helpers/strava.server";

// RESOURCE ROUTE
export async function loader({request}) {
    const userId = await requireUserId(request);
    console.log("/strava_subs/create ")
    const ret_data = await createStravaSubscription();
    return ret_data;
}
    


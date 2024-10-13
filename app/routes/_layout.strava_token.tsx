import { redirect } from "@remix-run/node";
import { getSearchParamsAsJson } from "~/helpers/webUtils.server";
import {getKV, setKV} from "~/module/kv.server";
import { requireUserId } from "~/module/session/session.server";
import date from "date-and-time"
import { getStravaToken, KV_EXPIRY_STRAVA } from "~/helpers/strava.server";
//import { get } from "lodash";
// RESOURCE ROUTE
// GET strava token using the code and scope
export async function loader({request}) {

// validate if we have a user!
const userId = await requireUserId(request);

const {code, scope, error } = getSearchParamsAsJson(request);
    if (error) {
      const msg=`No code from Strava: ${error}`
      console.log(msg)
      return new Response(msg,{status:500})
    }
    
    console.log("/strava_token: @TODO: Check scope - reminder to compare with requested scope and re-oauth if different")
    console.log("/strava_token: returned " ,code,scope,error);
    // Got code from strava
    // Now get  Token 
    
    console.log("/strava_token : userId ",userId);
   // Get Token from Strava
    const json = await getStravaToken(code,false); // refresh = false
    const expires_at = date.addSeconds(new Date(),json?.expires_in);
    json.expires_at = expires_at;
    console.log("strava_token " ,json);
    // Save Token and other details  in KV with key = userId
    const result = await setKV(userId,JSON.stringify(json),KV_EXPIRY_STRAVA);
    
    console.log("/strava_token : setKV returned ",result)
    return redirect("/");
}


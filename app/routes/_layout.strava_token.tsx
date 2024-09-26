import { redirect } from "@remix-run/node";
import { getSearchParamsAsJson } from "~/helpers/webUtils.server";
import {setKV} from "~/module/kv.server";
import { requireUserId } from "~/module/session/session.server";
import date from "date-and-time"
import { getStravaToken, KV_EXPIRY_STRAVA } from "~/helpers/strava.server";
//import { get } from "lodash";
// RESOURCE ROUTE
export async function loader({request}) {


const {code, scope, error } = getSearchParamsAsJson(request);
    if (error) {
      const msg=`No code from Strava: ${error}`
      console.log(msg)
      return new Response(msg,{status:500})
    }

    // validate if we have a user!
    const userId = await requireUserId(request);

    console.log("/strava_token: Check scope - reminder")
    console.log("/strava_token: returned " ,code,scope,error);
    // Got code from strava
    // Now get  Token 
    
    console.log("/strava_token : userId ",userId);
    // const url = "https://www.strava.com/oauth/token";
    // const formData = new FormData();
    // formData.append("client_id", process.env.STRAVA_CLIENT_ID);
    // formData.append("client_secret", process.env.STRAVA_CLIENT_SECRET);
    // formData.append("code", code);
    // formData.append("grant_type", "authorization_code");
    // const response = await fetch(url, {
    //     method: "POST",
    //      body: formData,
    // });
    // if (!response.ok) {
    //   return new Response("Error during Strava auth",{status:500})
    // }
    // const json = await response.json();
    const json = await getStravaToken(code,false); // refresh = false
    const expires_at = date.addSeconds(new Date(),json?.expires_in);
    json.expires_at = expires_at;
    console.log("strava_token " ,json);
    // Save Token and other details  in KV with key = userId
    const result = await setKV(userId,JSON.stringify(json),KV_EXPIRY_STRAVA);
    
    console.log("/strava_token : setKV returned ",result)
    return redirect("/");
}


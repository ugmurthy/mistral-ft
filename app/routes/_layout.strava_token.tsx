import { redirect } from "@remix-run/node";
import { getSearchParamsAsJson } from "~/helpers/webUtils.server";
import {setKV} from "~/module/kv.server";
import { requireUserId } from "~/module/session/session.server";
// RESOURCE ROUTE
export async function loader({request}) {

const {code, scope, error } = getSearchParamsAsJson(request);
  if (code) {

    console.log("strava_authorise returned " ,code,scope,error);
    // Got code from strava
    // Now get  Token 
    const userId = await requireUserId(request);
    console.log("/strava_token : userId ",userId);
    const url = "https://www.strava.com/oauth/token";
    const formData = new FormData();
    formData.append("client_id", process.env.STRAVA_CLIENT_ID);
    formData.append("client_secret", process.env.STRAVA_CLIENT_SECRET);
    formData.append("code", code);
    formData.append("grant_type", "authorization_code");
    const response = await fetch(url, {
        method: "POST",
         body: formData,
    });
    const json = await response.json();
    console.log("strava_token returned " ,json);
    // Save Token and other details  in KV with key = userId
    await setKV(userId,JSON.stringify(json));
    return json
    }
  
    return {"error":"Something went wrong while gettig strava token"};
}

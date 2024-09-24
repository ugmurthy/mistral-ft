import { redirect } from "@remix-run/node";
import { getSearchParamsAsJson } from "~/helpers/webUtils.server";
// RESOURCE ROUTE
export async function loader({request}) {

    const {code, scope, error } = getSearchParamsAsJson(request);
  if (code) {
    console.log("/ : strava/authorize returned " ,code,scope,error);
    // Get Token from strava
    // Save Token in DB
    // Redirect to /
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
    console.log("/ : strava/token returned " ,json);
    // Save Token in KV
    
    }
  
}

import { redirect } from "@remix-run/node";
import {getStravaAuthoriseURL} from "../helpers/strava.server";
import { requireUserId } from "~/module/session/session.server";
// RESOURCE ROUTE
// Get STRAVA Authorisation for access to this APP for this user for a given scope.
// This is called from the client side when the user clicks the "Authorise Strava" button.
export async function loader({request}) {
    const userId = await requireUserId(request); // if not logged in this will redirect to login.
    console.log("/strava_authorise : userId : ",userId);
    const scope = "activity:read_all,activity:write,profile:read_all,read";
    const redirect_uri = "https://rungenie.vercel.app/strava_token";
    //const redirect_uri = "https://rungenie.vercel.app/"
    const url = getStravaAuthoriseURL(redirect_uri,scope);
    console.log("/strava_authorise : url ",url);
    console.log("/strava_authorise : redirect to Strava");
    return redirect(url);// which inturn will call redirect url
}

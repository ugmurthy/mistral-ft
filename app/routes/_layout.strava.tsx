import { redirect } from "@remix-run/node";

// RESOURCE ROUTE
export async function loader({request}) {

    const client_id = process.env.STRAVA_CLIENT_ID? process.env.STRAVA_CLIENT_ID : "";
    if (client_id === "") {
        throw new Response("No client id found in .env", {status: 500});
    }
    let url = "https://www.strava.com/oauth/authorize"
    const params = {client_id,
        redirect_uri:"http://localhost:5173",
        response_type:"code",
        approval_prompt:"auto",
        scope:"activity:read,read"};
    const queryString = new URLSearchParams(params).toString();
    url = `${url}?${queryString}`;
    console.log("/strava : ",url);
    return redirect(`${url}?${queryString}`);
}

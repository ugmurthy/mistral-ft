import { json, redirect, useLoaderData } from "@remix-run/react";
import Login from "~/components/Login";
import { getGoogleProfileAndJWT } from "~/module/auth.server";
import { createTokenSession, validToken } from "~/module/sessions.server";

export const loader = async ({request}) => {
    const decodedToken = await validToken(request);
    console.log("LOADER : /login decodedToken :",decodedToken?"Got decoded data":"Null Token");
    if (decodedToken) {    
        return redirect("/");
    } else {
        const google_client_id = process.env.GOOGLE_CLIENT_ID;
        return json({google_client_id});
    }
    
    }

    export const action = async ({request}) => {
        // get user profile and jwt token
        const {user,token} = await getGoogleProfileAndJWT(request);
        console.log("ACTION: /login user ",user.name); 
        //console.log("ACTION: /login token ",token);
        if (user?.verified_email) {
            console.log("ACTION: All good: Redirect to /")
            const headers = await createTokenSession(token);
            return redirect("/", {
                headers,
            });
        } else {
            console.log("ACTION: user not verified redirecting to /login");
            return redirect("/login");
        }
    }

    export default function Posts() {
    const {google_client_id} = useLoaderData();
    console.log("google_client_id ",google_client_id);

        return (
            <Login gid={google_client_id} />
        );
    }
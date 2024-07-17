import { json, redirect, useLoaderData } from "@remix-run/react";
import Disclaimer from "~/components/Disclaimer";
import Login from "~/components/Login";
import { getGoogleProfileAndJWT } from "~/module/auth.server";
import { createTokenSession, validToken } from "~/module/sessions.server";

export const loader = async ({request}) => {
    const decodedToken = await validToken(request);
    console.log("LOADER : /login decodedToken :",decodedToken?"Got decoded data\n":"Null Token");
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
        /*
        user  {
            id: '111301335296643912403',
            email: 'xxxxxx@gmail.com',
            verified_email: true,
            name: 'X Y Murthy',
            given_name: 'X Y',
            family_name: 'Murthy',
            picture: 'https://lh3.googleusercontent.com/a/ACg8ocJDvkXdZWssMeCIG0mwF_JdWVtk6vQfMIPiPY1dt7NxR__s9pP3RA=s96-c'
            }
        */
        console.log("ACTION: /login user ",user.name); 
        //console.log("ACTION: /login token ",token);
        if (user?.verified_email) {
            /// xata.io :1 create user if user does not exist
            /// xata.io :2 update user if user exists as things may have changed
            /// xata.io :3 create session for user with remembmer me option=true
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
            <div className="px-2 md:px-6" >
            <Login gid={google_client_id} />
            <Disclaimer/>
            </div>
        );
    }
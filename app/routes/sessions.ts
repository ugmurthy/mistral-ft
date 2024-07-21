// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node"; 

type SessionData = {
  reference: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      // a Cookie from `createCookie` or the CookieOptions to create one
      cookie: {
        name: "coach_session",

        // all of these are optional
        //domain: "",
        // Expires can also be set (although maxAge overrides it when used in combination).
        // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
        //
        // expires: new Date(Date.now() + 60_000),
        httpOnly: true,
        maxAge: 604800, 
        //maxAge: 604800 = a week
        //maxAge:60, // for testing
        path: "/",
        sameSite: "none",
        secrets: ["Coach_s3cret1"],
        secure: true,
      },
    }
  );



 function validAPI(apikey:string, route:string) {
  const keys = [process.env.API_1, process.env.API_2, 
                process.env.API_3, process.env.API_4,
                process.env.API_5, process.env.API_6,
              ];
  //console.log("keys ",keys)
  const idx = keys.indexOf(apikey?.trim());
  if (idx !== -1) {
    console.log(`${route} : Authenticated`)
    return true;
  } else {
    console.log(`${route} : Authentication failed`)
    return false;
  }
}

 async function createAPISession(apikey, headers = new Headers()) {
  const session = await getSession();
  session.set('apikey', apikey);
  console.log("Create Session with apikey")
  headers.set('Set-Cookie', await commitSession(session));
  //console.log('createAPISession ',apikey);
  return headers;
}

 async function getAPIkey(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  const apikey = session.get('apikey');
  //console.log('get api key ', apikey);
  return apikey;
}

async function authenticate(request:Request, route) {
  const session = await getSession(request.headers.get("Cookie"))
  const apikey = session.get("apikey");
  return validAPI(apikey, route)
}

export { getSession, commitSession, destroySession , validAPI, getAPIkey, createAPISession, authenticate};
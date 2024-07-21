// import { logout } from "~/module/sessions.server";

// export async function loader({request}) {
    
//     return logout(request);
// }

import type {  LoaderFunctionArgs } from '@remix-run/node';

import { logout } from '../module/session/session.server'

/* export async function action({ request }: ActionFunctionArgs) {
  return await logout(request);
} */

export async function loader({request}:LoaderFunctionArgs) {
    console.log("Logout : Logging out...")
    return await logout(request)
}

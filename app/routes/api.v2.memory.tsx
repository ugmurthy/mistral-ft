
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { mistralChat, dumpMessage} from "~/api/mistralAPI.server";
import {getKV} from '../module/kv.server'
import { getConversationSession, getFeaturesSession, requireUserId } from "~/module/session/session.server";

export async function loader({ request }: LoaderFunctionArgs) {

  // ascertain valid user
  const userId = await requireUserId(request);
  const features = await getFeaturesSession(request);
  //console.log("/api/v2/mistral: user Authenticated: ",userId);
  //console.log("/api/v2/mistral: features: ",features);
  
  if (!userId) {  // if no user is logged in
      throw redirect("/login");
      }
  
// get conversation id from session
const cId = await getConversationSession(request)
  
console.log("/api/v2/memory: cId: ",cId);
let memory = await getKV(cId)
// deal with null memory
if (memory === null) {
    console.log("/api/v3/memory: get_memory is null")
    memory = []
}

return json({memory})

}
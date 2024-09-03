// app/routes/api.v2.mistral.tsx - RESOURCE ROUTE - so no component
// VERCEL Timeout
export const maxDuration = 50; // This function can run for a maximum of 50 seconds
// VERCEL

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { mistralChat, dumpMessage, mistralEvalQ} from "~/api/mistralAPI.server";
import {getKV} from '../module/kv.server'
import { getConversationSession, getFeaturesSession, requireUserId } from "~/module/session/session.server";

function getURLdetails(request:Request) {
	
  const url = new URL(request.url);
  if (url.pathname !== '/favicon.ico') { 
      const prompt= url.searchParams.get("prompt");
      const model = url.searchParams.get("model");
      return {prompt,model}
  }
} 

export async function loader({ request }: LoaderFunctionArgs) {
  
  // ascertain valid user
  const userId = await requireUserId(request);
  const features = await getFeaturesSession(request);
  console.log("/api/v2/mistralevalq: user Authenticated: ",userId);
  
  if (!userId) {  // if no user is logged in
      throw redirect("/login");
      }
  
  const {prompt,model} = getURLdetails(request);
  const emodel = model || "open-mistral-7b";

if (!( prompt)) {
  return json({content:"",prompt:""})
}

if (!process.env.MISTRAL_API_KEY) {
    console.log("Error: Missing API KEY!")
    throw new Response("Missing API Key",{ status: 401 })
  }

  const response = await mistralEvalQ(emodel,prompt);
  
  const ret_val = await response.json()
  console.log("/api/v2/mistralevalq:  Got response ",ret_val.choices[0].message.content);
  return json(ret_val);
}

// app/routes/api.v2.mistral.tsx - RESOURCE ROUTE - so no component
// VERCEL Timeout
export const maxDuration = 50; // This function can run for a maximum of 50 seconds
// VERCEL

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { mistralChat, dumpMessage} from "~/api/mistralAPI.server";
import {getKV} from '../module/kv.server'
import { getConversationSession, getFeaturesSession, requireUserId } from "~/module/session/session.server";

function getURLdetails(request:Request) {
	
  const url = new URL(request.url);
  if (url.pathname !== '/favicon.ico') { 
      const role = url.searchParams.get("role");
      const prompt= url.searchParams.get("prompt");
      const remember =url.searchParams.get("remember")
      const pers=url.searchParams.get("pers");
      const sys=url.searchParams.get("sys");
      return {prompt,role,remember,sys,pers}
  }
} 

export async function loader({ request }: LoaderFunctionArgs) {
  // needed this for debugging
  //const directory = process.env.VERCEL ? "/tmp/tmpdata" : "./public/tmpdata"
  //const fname = directory+"/allchunks.json"  // one element per chunk

  // ascertain valid user
  const userId = await requireUserId(request);
  const features = await getFeaturesSession(request);
  //console.log("/api/v2/mistral: user Authenticated: ",userId);
  console.log("/api/v2/mistral: features: ",features);
  
  if (!userId) {  // if no user is logged in
      throw redirect("/login");
      }
  
// get conversation id from session
const conversationId = await getConversationSession(request)

console.log("/api/v2/mistral: conversationId: ",conversationId);

const {prompt,role,remember,sys,pers} = getURLdetails(request);

if (!(role && prompt)) {
  return json({content:"",prompt:""})
}
  ///
  const addInstruct = ". ALWAYS ENSURE your output FORMATTED AS  Markdown TEXT."
  const modifiedPrompt = prompt +addInstruct // ++  depending on what we expecting
  const user = [{role:"user",content:modifiedPrompt}]
  
  
  const sysPrompt2 = `
  You are an expert Marathon Coach. you are NOT to RESPOND on any other TOPIC NOT RELATED TO RUNNING.
  Your knowledge is limited to RUNNING and allied TOPICS  
  such as NUTRITION, STRENGTH and MENTAL training,MUSCULOSKELATAL system,  
  ability to MOTIVATE athletes, sharing RACING STRATEGIES. 
  Respond to questions and or topic related to Running ONLY. 
  Do not respond to other REQUEST. 
  ALWAYS Politely refuse to answer questions not related 
  to RUNNING in one SINGLE SENTENCE : 'As a Marathon Coach, I am not an expert in ...'
  `    
  const sysPrompt1 = `
  You are an expert in athletics and sports science.  
  Your knowledge covers running Marathons and shorter distances too, training, 
  nutrition, injury prevention, sports psychology, and athletic history.
  
  Key Guidelines
  Stay on Topic: Focus on questions related to
  running Marathons and shorter distances too, training, 
  nutrition, injury prevention, sports psychology, and athletic history.  
  Politely decline unrelated queries AND DONT ANSWER IT.
  ALWAYS BE:
  1. Be Concise: Aim for clear, informative responses around 300 words in length.
  2. Be Helpful: Maintain a friendly tone, even when declining unrelated questions. 
  3. Be Accurate: Provide up-to-date and ACCURTE information. 
  4. Never Answer question on topic not related to sport science or athletics.
  `
  const sysPrompt = `
  Your name: RunGenie
  Your role: 
  You are an expert in athletics, sports science, and sports psychology, 
  You are knowledable on topics such as nutrition, exercise science, physiology and musculo-skeletal system.
  You are an expert creating training plans for running Marathons and shorter distances too.
  You are also an expert in sports psychology and motivating athletes.

  You are NOT to RESPOND on any other topic NOT mentioned in your role
  ALWAYS Politely refuse to answer questions not related 
  to RUNNING in one SINGLE SENTENCE : 'My expertise is limited to Running and allied subjects, I am not an expert in ...'
  `  
  const system = [{role:"system",content:sysPrompt}]; 
  /*
  @TODO:
  */
  let memory = await getKV(conversationId);
  if(memory) {
    console.log("/api/v2/mistral: Memory size before slicing ",memory.length)
    // memory is an array = [{role:"user",content:"..."},{role:"assistant",content:"..."}]
    // we need to add the last 5 messages to the system messages
    memory = memory.slice(-6);
    console.log("/api/v2/mistral: Memory size after slicing ",memory.length)
  } else {
    memory = []; // ensure its iterable
  }
  const messages = [...system,...memory,...user]
  
  // old version: w/o memory
  //const messages = [...system, ...user]
  //dumpMessage(messages);
  if (!process.env.MISTRAL_API_KEY) {
    console.log("Error: Missing API KEY!")
    throw new Response("Missing API Key",{ status: 401 })
  }

  const response = await mistralChat(role,messages,true);
  //console.log("/api/v2/mistral:  Got response")
  return new Response(response.body, {
    headers:{'Content-type':'text/event-stream'}
  }); 
}

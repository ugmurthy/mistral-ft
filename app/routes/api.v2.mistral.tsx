// app/routes/api.v2.mistral.tsx - RESOURCE ROUTE - so no component
// VERCEL Timeout
export const maxDuration = 50; // This function can run for a maximum of 50 seconds
// VERCEL

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { mistralChat, modelDesc} from "~/api/mistralAPI.server";


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
 

const {prompt,role,remember,sys,pers} = getURLdetails(request);

console.log(`remember ${remember}`);
console.log(`pers ${pers}`);
console.log(`sys ${sys}`);


if (!(role && prompt)) {
  return json({content:"",prompt:""})
}
  ///
  const addInstruct = "ALWAYS ENSURE your output FORMATTED AS  Markdown TEXT."
  const modifiedPrompt = prompt +addInstruct // ++  depending on what we expecting
  const user = [{role:"user",content:modifiedPrompt}]
  
  
  const sysPrompt1 = `
  You are an expert Marathon Coach. you are NOT to RESPOND on any other TOPIC NOT RELATED TO RUNNING.
  Your knowledge is limited to RUNNING and allied TOPICS  
  such as NUTRITION, STRENGTH and MENTAL training,MUSCULOSKELATAL system,  
  ability to MOTIVATE athletes, sharing RACING STRATEGIES. 
  Respond to questions and or topic related to Running ONLY. 
  Do not respond to other REQUEST. 
  ALWAYS Politely refuse to answer questions not related 
  to RUNNING in one SINGLE SENTENCE : 'As a Marathon Coach, I am not an expert in ...'
  `    
  const sysPrompt = `
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
  const system = [{role:"system",content:sysPrompt}]; 
  const messages = [...system, ...user]
  
  if (!process.env.MISTRAL_API_KEY) {
    console.log("Error: Missing API KEY!")
    throw new Response("Missing API Key",{ status: 401 })
  }

  const response = await mistralChat(role,messages,true);
  console.log("/api/v2/mistral:  Got response")
  return new Response(response.body, {
    headers:{'Content-type':'text/event-stream'}
  }); 
}
/*
export async function loaderOLD({ request }: LoaderFunctionArgs) {

  const {prompt,role,remember} = getURLdetails(request);

  const model = role==="Coach"?"mistral":null;
    if (!model) {
      throw new Error("Invalid or no role provided")
    }
    const modifiedPrompt = prompt // ++  depending on what we expecting
    const user = [{role:"user",content:modifiedPrompt}]
    //@TODO : get a prompt for 'system' depending on 'role' for now it is null
    const system = [{role:"system",content:"You are a world class Marathon Coach. Respond to questions and or topic related to Running. Politely refuse to answer other questions"}]; //@TODO
    const messages = [...system, ...user]

    //1 const ret_val = await chat(model,messages,false);
    //2 return {data:ret_val,prompt};

    const response = await mistralChat(role,messages,true);

  
  if (!response.ok) {
    throw json(
      { message: "Failed to fetch chat stream" },
      { status: response.status }
    );
  }

  if (!response.body) {
    throw new Error("Chat stream response has no body");
  }
  console.log("2. Got Response. from mistral")
 
  
  return new Response(response.body, {
          headers:{'Content-type':'text/event-stream'}
        });
}
*/
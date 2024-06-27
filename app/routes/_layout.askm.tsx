// app/routes/chat.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { mistralChat } from "~/api/mistralAPI.server";
import Prompt from "~/components/Prompt";
import { useLoaderData } from "@remix-run/react";
import CommandCopy from "~/components/CommandCopy";
import MarkDown from "~/components/MarkDown";
import {write_file } from "../helpers/fs.server"
import {chunks2JSON, getStats, jsonArray2Content} from '../helpers/processChunks.server';

function getURLdetails(request:Request) {
	
  const url = new URL(request.url);
  if (url.pathname !== '/favicon.ico') { 
      const role = url.searchParams.get("role");
      const prompt= url.searchParams.get("prompt");
      const remember =url.searchParams.get("remember")
      return {prompt,role,remember}
  }
} 


export async function loader({ request }: LoaderFunctionArgs) {

    const directory = process.env.VERCEL ? "/tmp/tmpdata" : "./public/tmpdata"
    //const fname = directory+"/allchunks.json"  // one element per chunk
   
  
  const {prompt,role,remember} = getURLdetails(request);

  if (!(role && prompt)) {
    return json({content:"",prompt:""})
  }
    ///
    const addInstruct = "ALWAYS ENSURE your output is in markdown format.Provide titles,subtitled, emphasis. where appropriate"
    const modifiedPrompt = prompt +addInstruct // ++  depending on what we expecting
    const user = [{role:"user",content:modifiedPrompt}]
    const sysPrompt = `
    You are an expert Marathon Coach. you are NOT to RESPOND on any other TOPIC NOT RELATED TO RUNNING.
    Your knowledge is limited to RUNNING and allied TOPICS  
    such as NUTRITION, STRENGTH and MENTAL training,MUSCULOSKELATAL system,  
    ability to MOTIVATE athletes, sharing RACING STRATEGIES. 
    Respond to questions and or topic related to Running ONLY. 
    Do not respond to other REQUEST. 
    ALWAYS Politely refuse to answer questions not related 
    to RUNNING in one SINGLE SENTENCE : 'As a Marathon Coach, I am not an expert in ...'
    `    
   
    const system = [{role:"system",content:sysPrompt}]; 
    const messages = [...system, ...user]
    ///

    //1 const ret_val = await chat(model,messages,false);
    //2 return {data:ret_val,prompt};

    const response = await mistralChat(role,messages,true);
    console.log(messages)
  if (!response.ok) {
    throw new Response('API Error', { status: response.status });
  }
  if (!response.body) {
    new Response("Response stream response has no body",{status:500})
    
  }

  console.log("1. Got Response. from mistral")
  const reader = response.body.getReader();
  if (!reader) {
    throw new Response("Error reading response",{status:500})
  }
  console.log("2. Reader set up")
  let data = [];
  let content = ""

  while(true) {
    
    const {done,value } = await reader.read()
    if (done) {
      console.log("3. Reading completed")
      break;
    }
    const chunk = new TextDecoder().decode(value);
    const jlines = chunks2JSON(chunk)
    data = [...data, ...jlines]
  }
  
  content = jsonArray2Content(data);
  const last = data[data.length-1];
  let stats=''
  if (last?.usage) {
    stats=getStats(last)
  }
  return json({prompt,content,stats});
  
}
export default function Component(){
  const {content,prompt,stats} = useLoaderData<typeof loader>(); 
  
  if (prompt==="") {
    return (
      <Prompt aiRole='Coach'/>
    )
  }
  
  return (
      <div className="p-10">
      <div>{prompt}</div> 
      <CommandCopy txt={prompt} btnTxt="Copy"></CommandCopy>
      
      
       <div className="chat chat-start">
            <div className="chat-image avatar">
                <div className="w-10 ">
                <img
                    alt="Tailwind CSS chat bubble component"
                    src="/mistral.png" />
                </div>
            </div>
            
            <div className="chat-bubble"> <CommandCopy txt={content} btnTxt="Copy"></CommandCopy><MarkDown markdown={content} className={"font-thin text-sm"}></MarkDown> </div>
            
            <div className="chat-footer opacity-50">Token Stats : {stats}</div>
         </div>

      
     
      <div className="pt-20"></div>
      <Prompt></Prompt>
      </div>
  )
  
  }




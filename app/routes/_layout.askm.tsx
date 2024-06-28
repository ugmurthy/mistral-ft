// app/routes/chat.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { mistralChat ,modelDesc} from "~/api/mistralAPI.server";
import Prompt from "~/components/Prompt";
import { useLoaderData } from "@remix-run/react";
import CommandCopy from "~/components/CommandCopy";
import MarkDown from "~/components/MarkDown";
import {write_file } from "../helpers/fs.server"
import {chunks2JSON, getStats, jsonArray2Content} from '../helpers/processChunks.server';
import { useEffect, useState } from "react";
import IconAndDisplay from "~/components/IconAndDisplay";

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

    const directory = process.env.VERCEL ? "/tmp/tmpdata" : "./public/tmpdata"
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

    Be Concise: Aim for clear, informative responses around 300 words in length.

    Be Helpful: Maintain a friendly tone, even when declining unrelated questions. 
     
    Be Accurate: Provide up-to-date and ACCURTE information. 

    Never Answer question on topic not related to sport science or athletics.
    `
    const system = [{role:"system",content:sysPrompt}]; 
    const messages = [...system, ...user]
    ///

    //1 const ret_val = await chat(model,messages,false);
    //2 return {data:ret_val,prompt};
    if (!process.env.MISTRAL_API_KEY) {
      console.log("Error: Missing API KEY!")
      throw new Response("Missing API Key",{ status: 401 })
    }

    const response = await mistralChat(role,messages,true);
    ///console.log(messages)
  if (!response.ok) {
    throw new Response('API Error', { status: response.status });
  }
  if (!response.body) {
    throw new Response("Response stream response has no body",{status:500})
    
  }

  console.log("1. Got Response. from mistral")
  const reader = response.body.getReader();
  if (!reader) {
    throw new Response("Error reading response",{status:500})
  }
  console.log("2. Reader set up")
  let data = [];
  let content = ""
  let count=0; // just to keep track of progress
  while(true) {
    
    const {done,value } = await reader.read()
    count++
    if (done) {
      console.log("3. Reading completed ",count)
      break;
    }
    const chunk = new TextDecoder().decode(value);
    const jlines = chunks2JSON(chunk)
    data = [...data, ...jlines]
    if (count % 200===0) {
      console.log("chunks : ",count)
    }
  }
  
  content = jsonArray2Content(data);
  const last = data[data.length-1];
  let stats
  if (last?.usage) {
    stats=getStats(last)
  }
  stats = {...stats,...modelDesc(role)}
  return json({prompt,content,stats});
  
}
export default function Component(){
  const {content,prompt,stats} = useLoaderData<typeof loader>(); 
  const [isInfering,setIsInfering]=useState(false)
  
  useEffect(()=>{
    setIsInfering(false);
  },[content])

  if (prompt==="") {
    return (
      <Prompt aiRole='Coach' transition={setIsInfering}/>
    )
  }
  

  if (content) {
    return (
    <div className="flex flex-col justify-center">
        <IconAndDisplay prompt={prompt} content="" stats={stats}/>
        {isInfering?<div className="loading loading-spinner"></div>:""}
        <IconAndDisplay content={content} prompt="" stats={stats}/>
        <div className="pt-20"></div>
        <Prompt transition={setIsInfering}></Prompt>
    </div>)
  }    
  }




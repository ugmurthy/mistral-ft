
import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import {  useLoaderData } from "@remix-run/react";
import Prompt from '../components/Prompt'

import { useCallback, useEffect, useState } from "react";
import _ from "lodash";
function getURLdetails(request:Request) {
	
    const url = new URL(request.url);
    if (url.pathname !== '/favicon.ico') { 
        const role = url.searchParams.get("role");
        const prompt= url.searchParams.get("prompt");
        const remember =url.searchParams.get("remember")
        return {prompt,role,remember}
}
} 



export const loader:LoaderFunction = async ({request}:LoaderFunctionArgs )=>{
    const {prompt,role,remember} = getURLdetails(request);
    
    if (!(role && prompt)) {
      return {role:"",prompt:""}
    }

    return {role,prompt}
}

export default function Component(){
const {role,prompt} = useLoaderData<typeof loader>(); 
const [data,setData]= useState([]);
const [chunks,setChunks]=useState([]);
const [isInfering,setIsInfering]=useState(false)
const url = `/api/v2/mistral?prompt=${prompt}&role=${role}`

console.log(`Role:${role},prompt:${prompt}`);
//////

function jsonArray2Content(allJSON) {
  let content=''
  for (const j of allJSON) { content += j.choices[0].delta.content}
  return content;
  }
  
///
useEffect(() => {
  if (prompt) {
    
    const eventSource = new EventSource(url);

    eventSource.onmessage = event => {

      setChunks(prevData => [...prevData, event.data]);
      if (event.data.includes('[DONE]')) {
        console.log("useEffect: Coach: We are all done! Closing EventSource...")
        eventSource.close();
      } else {
        setData(prevData => [...prevData, JSON.parse(event.data)]);
      } 
    };

    eventSource.onerror = error => {
      console.log("Error ",error);
      eventSource.close()
    }

    return () => {
      eventSource.close();
    };
  }
}, [prompt,role]);

///
// hook to capture stream
//////
if (prompt==="") {
  return (
    <Prompt aiRole='Coach' transition={isInfering}/>
  )
}
return (
    <div className="p-10">
    <div>{prompt}</div>    
    <div className="p-4">--------------</div>
    <div>{jsonArray2Content(data)}</div>
    <div className="p-4">--------------</div>
    <Prompt transition={isInfering}></Prompt>
    </div>
)

}

//<div className="font-thin">{jsonArray2Content(data)}</div>
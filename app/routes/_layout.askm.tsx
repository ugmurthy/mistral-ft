import type { LoaderFunction, LoaderFunctionArgs, SerializeFrom } from "@remix-run/node";
import { defer, json } from "@remix-run/node";
import { Await, useLoaderData, useNavigation, } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import {chat } from '../api/ollama.server';
import ChatData from "~/components/ChatData";
import { mistralChat } from "~/api/mistralAPI.server";
import Prompt from "~/components/Prompt";
import CommandCopy from "~/components/CommandCopy";

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
      return defer({dataPromise:{},prompt:""})
    }
    const addInstruct = ".Always ENSURE all output is in markdown format and provide titles, numbered subtitled, emphasis."
    const modifiedPrompt = prompt +addInstruct // ++  depending on what we expecting
    const user = [{role:"user",content:modifiedPrompt}]
    const sysPrompt = "You are an expert Marathon Coach. Your knowledge encompasses all allied fields related to running such as Nutrition, strength and mental training,musculoskeletal system, ability to motivate athletes, and racing strategy. Respond to questions and or topic related to Running. Politely refuse to answer other questions."
    //@TODO : get a prompt for 'system' depending on 'role' for now it is null
    const system = [{role:"system",content:sysPrompt}]; //@TODO
    const messages = [...system, ...user]

    const response = await mistralChat(role,messages,false);
    /*const data = await response.json();
    return {data,prompt} */
    
    const dataPromise = response.json();
    return defer({dataPromise,prompt})
}

export default function Component(){
const {dataPromise,prompt} = useLoaderData<typeof loader>(); 

if (prompt==="") {
  return (
    <Prompt aiRole='Coach'/>
  )
}
return (
  <div>
    {prompt!="" 
        ? 
        <div className="p=10">
          <div className="chat chat-start m-4">
              <div className="avatar chat-image">
                <div className="w-10 rounded-full">
                  <img src="avatar.png"alt="avatar"/>
                </div>
              </div>
              <div className="chat-bubble">{prompt} </div>
              <CommandCopy txt={prompt} btnTxt="Copy"></CommandCopy>
            </div>
          <div className="p-2 pl-4 font-thin">
          <Suspense fallback={'Loading....'}>
            <Await resolve={dataPromise} >
                {(resolvedData)=> <ChatData data={resolvedData}></ChatData>}
            </Await>
          </Suspense>
          </div>
        </div> 
        :""
    }
  <Prompt></Prompt>
  </div>
)

}

//<div className="loading loading-spinner"></div>
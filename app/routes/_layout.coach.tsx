
import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import {  useLoaderData } from "@remix-run/react";
import Prompt from '../components/Prompt'
import TextStreamComponent from "~/components/StreamCapture";

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
    const addInstruct = ".Always ENSURE all output is in markdown format and provide titles, numbered subtitled, emphasis."
    const modifiedPrompt = prompt +addInstruct // ++  depending on what we expecting
    const user = [{role:"user",content:modifiedPrompt}]
    const sysPrompt = "You are an expert Marathon Coach. Your knowledge encompasses all allied fields related to running such as Nutrition, strength and mental training,musculoskeletal system, ability to motivate athletes, and racing strategy. Respond to questions and or topic related to Running. Politely refuse to answer other questions."
    //@TODO : get a prompt for 'system' depending on 'role' for now it is null
    const system = [{role:"system",content:sysPrompt}]; //@TODO
    const messages = [...system, ...user]

    return {role,prompt}
}

export default function Component(){
const {role,prompt} = useLoaderData<typeof loader>(); 

if (prompt==="") {
  return (
    <Prompt aiRole='Coach'/>
  )
}

return (
    <div className="p-10">
    <div>{prompt}</div>    
    <TextStreamComponent url={`/api/v2/mistral?role=${role}&prompt=${prompt}`}></TextStreamComponent>
    <Prompt></Prompt>
    </div>
)

}
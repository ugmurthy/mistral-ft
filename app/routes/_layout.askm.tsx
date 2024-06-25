// app/routes/chat.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { mistralChat } from "~/api/mistralAPI.server";
import _ from 'lodash';
import Prompt from "~/components/Prompt";
import { useLoaderData } from "@remix-run/react";

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
  function chunks2Array(chunk) {
    function getStr(c) {
      if (c!=="") 
        try {
        return JSON.parse(c);
        } catch(e) {
          console.log("Error while parsing");
          console.log("chunks2Arrat : ",c)
          return {}
        }
     }
    // return an array of json objects
    // check if chunk has json objects, remove non-json objects from string
    const retval = chunk.split('\n').map((c)=>c.substring(_.indexOf(c,"{"),_.lastIndexOf(c,"}")+1))
    //console.log(retval)
    if (retval[retval.length-1]==="") {
      retval.pop();
    }
    const objArray = retval.map(getStr)
    //console.log("Chunks2Array: ",objArray);
    return _.compact(objArray)
  }

  function array2Content(data) {
    let result='';
    for (const chunk of data) {
        result = result + chunk.choices[0].delta.content;
    }
    return result
    
}
  const {prompt,role,remember} = getURLdetails(request);

    const modifiedPrompt = prompt // ++  depending on what we expecting
    const user = [{role:"user",content:modifiedPrompt}]
    //@TODO : get a prompt for 'system' depending on 'role' for now it is null
    const system = [{role:"system",content:"You are a world class Marathon Coach. Respond to questions and or topic related to Running. Politely refuse to answer other questions"}]; //@TODO
    const messages = [...system, ...user]

    //1 const ret_val = await chat(model,messages,false);
    //2 return {data:ret_val,prompt};

    const response = await mistralChat(role,messages,true);

  if (!response.ok) {
    throw new Response('API Error', { status: response.status });
  }
  if (!response.body) {
    throw new Error("Chat stream response has no body");
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
    
    data.push(chunks2Array(chunk))
  }
  console.log("Length data as is ",data.length)
  console.log("Length data flat  ",_.flatten(data).length)
  data = _.flatten(data);
  
  console.log("Final data length ",data.length)
  content = array2Content(data);
  return json({prompt,content});
  
}
export default function Component(){
  const {content,prompt} = useLoaderData<typeof loader>(); 
  
  if (prompt==="") {
    return (
      <Prompt aiRole='Coach'/>
    )
  }
  
  return (
      <div className="p-10">
      <div>{prompt}</div> 
      <div></div>   
      <div>{content}</div>
      <Prompt></Prompt>
      </div>
  )
  
  }




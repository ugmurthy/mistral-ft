// app/routes/chat.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, } from "@remix-run/react";
import { mistralChat } from "~/api/mistralAPI.server";
//import { mistralChat } from "~/api/openaiAPI";

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

  /* 
  const options ={
    method:"POST",
    headers:{"content-type":"application/json"},
    body: JSON.stringify({
        "model":"mistral",
        "messages":
        [
          {"role":"system",
            "content":"You are a world class Marathon Coach"
          },
        {
          "role":"user",
          "content":" how can I improve my Vo2 max"
        }
        ],
        "stream":true})};
  console.log("/api.chat3");
  console.log("1. options.....\n ",options);
  const response = await fetch("http://localhost:11434/api/chat",options); */

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







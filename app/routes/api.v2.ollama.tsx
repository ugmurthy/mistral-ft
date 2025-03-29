// app/routes/chat.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { generate } from "~/api/ollama.server";
//import { mistralChat } from "~/api/openaiAPI";

export async function loader({ request }: LoaderFunctionArgs) {

  //const body = await request.json();
  //console.log("Got Request....",body);
  
  const system = "You are a world class Marathon Coach";
  const prompt = "Generate a basic plan to run a 5k in 4 weeks"
  const model = "llama3.2:latest";
  const response = await generate(model,prompt,system,true);

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
  console.log("2. Got Response.......")
 
  return new Response(response.body, {
          headers:{'Content-type':'text/event-stream'}
        });
}


// Resource Route for Ollama API
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { generate, chat } from "~/api/ollama.server";


export async function action({ request }: LoaderFunctionArgs) {
  let {prompt,model, task} = await request.json();
  const system = "You are a helpful assistant";
  //const prompt = "Generate a basic plan to run a 5k in 4 weeks"
  //const model = "llama3.2:latest";
  
  if (!prompt) {
    return { error: "Missing prompt or model" };
  }
  if (!model) {
    return { error: "Missing model" };
  }

  console.log("api.v1.ollama.tsx: action() model,task ",model,task);
  console.log("api.v1.ollama.tsx: action() prompt ",prompt);
  console.log("api.v1.ollama.tsx: action() system ",system);
 
  const messages = [
    {role:"system",content:system},
    {role:"user",content:prompt}]

  //const response = await generate(model,prompt,system,true);
  const response = await chat(model,messages,true)
  
  if (!response.ok) {
    throw json(
      { message: "Failed to fetch chat stream" },
      { status: response.status }
    );
  }

  //return response;

  if (!response.body) {
    throw new Error("Chat stream response has no body");
  }
  console.log("2. Got Response.......")
 
  return new Response(response.body, {
        headers:{'Content-type':'application/x-ndjson'}
        });
}
/* 
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const prompt = url.searchParams.get("prompt");
  const model = url.searchParams.get("model");
  const task = url.searchParams.get("task");
  const system = "You are a helpful assistant";

  if (!prompt || !model) {
    return json({ error: "Missing prompt or model" }, { status: 400 });
  }

  console.log("api.v1.ollama.tsx: loader() model,task ",model,task);
  console.log("api.v1.ollama.tsx: loader() prompt ",prompt);

  const messages = [
    {role:"system",content:system},
    {role:"user",content:prompt}]

  //const response = await generate(model,prompt,system,true);
  const response = await chat(model,messages,true)
  
  if (!response.ok) {
    throw json(
      { message: "Failed to fetch chat stream" },
      { status: response.status }
    );
  }

  //return response;

  if (!response.body) {
    throw new Error("Chat stream response has no body");
  }
  console.log("3. Got Response.......")
 
  return new Response(response.body, {
          headers:{'Content-type':'application/x-ndjson'}
        });

  
};
 */
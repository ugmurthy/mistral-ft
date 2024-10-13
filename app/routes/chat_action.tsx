//
// Get all model details on openrouter
//


import db from '../module/xata.server'
import {  open_router_generate } from "~/api/openrouter";
//import { getFormData, isFormData } from "~/helpers/webUtils.server"
import { isValidURL, extractTextFromURLOrHTML } from '~/helpers/webUtils.server';
export async function action({request}) {
    const features={};
    let {prompt,model, task} = await request.json();
    console.log("/chat_action : task ", task);
    if (!prompt || !model) {
        return { error: "Missing prompt or model" };
    }
    
    // check if prompt is an valid url
    if (isValidURL(prompt)) {
        try {
        prompt = await extractTextFromURLOrHTML(prompt);
        console.log("/chat_action : prompt.length ", prompt.length);
        } catch (error) {
        console.error('Error extracting text:', error);
        return new Response(`Error extracting text from url: ${error}`,{status:500})
        }
    }
    
    // get task descript if task !=""
    const task_description = task? await db.getTaskDescription(task):"You are a helpful assistant";
    
    const system = task_description?{role:"system",content:task_description}:{};
    const user = {role:"user",content:prompt};
    const messages = [
            system, user
    ]
    //console.log("/chat_action : Messages ",JSON.stringify(messages,null,2));
    features.model = model;
    //console.log("/chat_action ",features?.model, prompt, task);
    const response = await open_router_generate(features,messages,true);
    if (response.ok) {
        return response;
    } else {
        const error = await response.json();
        console.log("Error ",error);
        
        return error;
    }
}


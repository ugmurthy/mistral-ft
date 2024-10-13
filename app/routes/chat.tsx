//
// Get all model details on openrouter
//


import {  open_router_generate } from "~/api/openrouter";
//import { useActionData } from "@remix-run/react";
import { getSearchParamsAsJson } from "~/helpers/webUtils.server";
//import { useState } from "react";


export async function loader({request}) {
    const features={};
    const {prompt,model } = getSearchParamsAsJson(request)
    //if (!isFormData(request)) {
    //    return { error: "Invalid form data" };
    //}

    //const {prompt,model} = await getFormData(request);

    if (!prompt || !model) {
        return { error: "Missing prompt or model" };
    }
    
    const messages = [
        {
            role: "user",
            content: prompt,
        },
    ]
    features.model = model;
    console.log("/api/v2/openrouter/chat ",features?.model, prompt);
    const response = await open_router_generate(features,messages,true);
    return response;
}


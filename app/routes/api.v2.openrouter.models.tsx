//
// Get all model details on openrouter
//

import { get_models } from "~/api/openrouter";
import { useLoaderData } from "@remix-run/react";
import {useState} from "react";
import ModelSelect from "../components/ModelSelect"
export async function loader() {
    const models = await get_models();
    console.log("/api/v2/openrouter/models ",models?.length)
    return models
}


export default function OpenRouterModels() {
    const models = useLoaderData();
    return (
        <div>
           <h1>OpenRouter Models</h1>
           <ModelSelect allmodels={models}></ModelSelect>
        </div>
    )
}
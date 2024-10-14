//
// Get all model details on openrouter
//

import { useActionData } from "@remix-run/react";
import { useState} from "react"
import { useOpenRouterGenerate } from "~/hooks/useOpenRouterGenerate";
import { getFormData,  } from "~/helpers/webUtils.server";
import Generate from "../components/OForm";
import MarkdownItRenderer from "~/components/MarkDown";
import SearchSelect from "~/components/SearchSelect";

export async function action({request}) {

    //const {prompt,model } = getSearchParamsAsJson(request);
    const {prompt} = await getFormData(request);
    const model = 'meta-llama/llama-3.2-1b-instruct';
    const task = 'summarise_paper';
    console.log("/api/v2/openrouter/summarisepaper (action) ",prompt, model,task);
    return { prompt, model,task };
} 


// based on eventsource-client 
export default function OpenRouterGenerate() {

    const {prompt,model,task } = useActionData()?useActionData():{};

    /// Assumes model exists - this validation to be done before using useOpenRouter
    /// @TODO - deal with useOpenRouterGenerator not getting a valid model. - it keep retrying indefinitely
    const data = useOpenRouterGenerate(prompt,model,task,false);
   
    function jsonArray2Content(allJSON) {
        let content=''
        const idSet = new Set();
        for (const j of allJSON) { 
            try {
            content += j.choices[0]?.delta.content
            idSet.add(j.id);
            } catch(e) {
                console.log("Error: jsonArray2Content: ",j)
            }
        }
        return [content,idSet];
    }

    const [content,idSet] = jsonArray2Content(data);
    const idArray = Array.from(idSet);
    

    return (
        <div>
            <form method="POST" className="p-10 space-y-2 flex flex-col items-center"  >
            <input
                    name="prompt"
                    type="text"
                    //onChange={handleInputChange}
                    placeholder="URL of paper"
                    className="input input-bordered input-primary w-full max-w-xs" />
            <button type="submit" className="btn btn-sm btn-primary">Summarise Paper</button>
            </form> 

        <div className="font-thin text-blue-600">
            <div className="px-4 pt-4 text-xs font-thin text-red-600">
                <div>Model: {model}</div>
                <div>URL:  {prompt?.length>100 ?prompt?.slice(0,100)+"...": prompt}</div>
                <div>Task: {task}</div>
                
            </div>
            <div className="p-4 text-xs font-thin text-blue-700">
                {data.length > 0 && <div>
                 <pre>{JSON.stringify(idArray)} </pre> 
                 <pre>{JSON.stringify(data[data.length-1]?.usage)} </pre>
                 </div>}
            </div>
            <div className="text-sm mx-4 p-4 bg-gray-100 rounded-lg">
            <MarkdownItRenderer markdown={content} className={"text-gray-900 "}></MarkdownItRenderer>
            </div>
            
        </div>
            
        </div>
    )
    
}
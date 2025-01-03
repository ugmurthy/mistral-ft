//
// Get all model details on openrouter
//

import { useActionData } from "@remix-run/react";
import { useOpenRouterGenerate } from "~/hooks/useOpenRouterGenerate";
import { getFormData,  } from "~/helpers/webUtils.server";
import Generate from "../components/Generate";

export async function action({request}) {

    //const {prompt,model } = getSearchParamsAsJson(request);
    const {prompt} = await getFormData(request);
    const model = 'meta-llama/llama-3.2-3b-instruct:free';
    const task = 'summarise_paper';
    console.log("/api/v2/openrouter/summarisepaper (action) ",prompt, model,task);
    return { prompt, model,task };
} 


// based on eventsource-client 
export default function OpenRouterGenerate() {

    const {prompt,model,task } = useActionData()?useActionData():{};

    /// Assumes model exists - this validation to be done before using useOpenRouter
    /// @TODO - deal with useOpenRouterGenerator not getting a valid model. - it keep retrying indefinitely
    const [content,idArray,usage] = useOpenRouterGenerate(prompt,model,task,false);
   
    

    return (
        <div>
            <form method="POST" className="p-10 space-y-2 flex flex-col items-center"  >
                <input
                        name="prompt"
                        type="text"
                        placeholder="URL of paper"
                        className="input input-bordered input-primary w-full max-w-xs" />
                <button type="submit" className="btn btn-sm btn-primary">Summarise Paper</button>
            </form> 

        <div>
            
            <div className=" text-sm mx-4 p-4 bg-gray-100 rounded-lg">
                <Generate model={model} prompt={prompt} task={task}></Generate>
            </div>
            
        </div>
            
        </div>
    )
    
}
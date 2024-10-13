//
// Get all model details on openrouter
//

import { useActionData } from "@remix-run/react";
import { useState} from "react"
import { useOpenRouterGenerate } from "~/hooks/useOpenRouterGenerate";
import { getFormData,  } from "~/helpers/webUtils.server";
import Generate from "../components/OForm";
import MarkdownItRenderer from "~/components/MarkDown";

export async function action({request}) {

    //const {prompt,model } = getSearchParamsAsJson(request);
    const {prompt,model,task } = await getFormData(request);
    console.log("/api/v2/openrouter/generate (action) ",prompt, model);
    return { prompt, model,task };
} 


// based on eventsource-client 
export default function OpenRouterGenerate() {

    const {prompt,model,task } = useActionData()?useActionData():{};

    /// Assumes model exists - this validation to be done before using useOpenRouter
    /// @TODO - deal with useOpenRouterGenerator not getting a valid model. - it keep retrying indefinitely
    const data = useOpenRouterGenerate(prompt,model,task,false);
    const [submitted,setSubmitted]=useState(false);

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


/// form submit handler
    const handleSubmit = (e) => {
    setSubmitted(true);
    }
///
/* 
const evtSource = useCallback( (prompt:string,model:string) => {
        console.log("Callback: OpenRouterGenerate: ",prompt,model);
        const es = createEventSource({
            url: `/chat_action`,
            headers: {
                Accept: 'text/event-stream',
            },
            method: 'POST',
            body: JSON.stringify({
                prompt: prompt,
                model: model
            }),
            onMessage: ({data,event,id}) => {
                
                if (data.includes('[DONE]')) {
                    console.log("useEffect: OpenRouterGenerate: We are all done! Closing EventSource...")
                    es.close();
                } else {
                    try {
                    const chunk = JSON.parse(data);
                    console.log(chunk.id, chunk.choices[0].delta.content);
                    setData(prevData => [...prevData, chunk]);
                    //setText(prevTxt => prevTxt+chunk.choices[0].delta.content);
                    } catch(e) {
                        console.log(`Error: EventSource: While Parsing : ${data} `,e)
                    }
                }
            },
            
            });
            console.log(es.readyState) 
},[model,prompt])
 */
/* 
useEffect(() => {
    if ( !prompt || !model) return;
    console.log("useEffect: OpenRouterGenerate: ",prompt,model);

    if (!esRef.current) { // prevent second call
         esRef.current = createEventSource({
        url: `/chat_action`,
        headers: {
            Accept: 'text/event-stream',
        },
        method: 'POST',
        body: JSON.stringify({
            prompt: prompt,
            model: model
        }),
        onMessage: ({data,event,id}) => {
            
            if (data.includes('[DONE]')) {
                console.log("useEffect: OpenRouterGenerate: We are all done! Closing EventSource...")
                esRef.current.close();
            } else {
                try {
                const chunk = JSON.parse(data);
                console.log(chunk.id, chunk.choices[0].delta.content);
                setData(prevData => [...prevData, chunk]);
                //setText(prevTxt => prevTxt+chunk.choices[0].delta.content);
                } catch(e) {
                    console.log(`Error: EventSource: While Parsing : ${data} `,e)
                }
            }
        },
        
            });
    }

    return () => { // teardown EventSource to cleanup
        if (esRef.current) {
            esRef.current.close();
            esRef.current = null;
        }
    }
    //if (submitted) {
    //    evtSource(prompt,model);
    //}
},[prompt,model])
 */
    const [content,idSet] = jsonArray2Content(data);
    const idArray = Array.from(idSet);
    

    return (
        <div>
            <form method="POST" className="p-10 space-y-2 flex flex-col items-center" onSubmit={handleSubmit} >
            <input
                    name="prompt"
                    type="text"
                    //onChange={handleInputChange}
                    placeholder="Ask me anything"
                    className="input input-bordered input-primary w-full max-w-xs" />
            <input
                    name="model"
                    type="text"
                    //onChange={handleInputChange}
                    placeholder="model"
                    className="input input-bordered input-primary w-full max-w-xs" />
            <input
                    name="task"
                    type="text"
                    //onChange={handleInputChange}
                    placeholder="task"
                    defaultValue=""
                    className="input input-bordered input-primary w-full max-w-xs" />
            <button type="submit" className="btn btn-sm">Submit</button>
            </form>

        <div className="text-xs font-thin text-blue-600">
            <div className="px-4 pt-4 text-xs font-thin text-red-600">
                <div>Model: {model}</div>
                <div>Prompt:  {prompt?.length>100 ?prompt?.slice(0,100)+"...": prompt}</div>
                <div>Task: {task}</div>
            </div>
            <div className="p-4">Streaming response :
                {data.length > 0 && <div>
                 <pre>{JSON.stringify(idArray)} </pre> 
                 <pre>{JSON.stringify(data[data.length-1]?.usage)} </pre>
                 </div>}
            </div>
            <div className="mx-4 p-4 bg-gray-100 rounded-lg">
            <MarkdownItRenderer markdown={content} className={"text-gray-900"}></MarkdownItRenderer>
            </div>
            
        </div>
            <Generate model={"liquid/lfm-40b"} prompt={prompt} task={task}></Generate>
            
        </div>
    )
    
}
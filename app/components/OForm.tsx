/*
Sample component on how to use the useOpenRouterGenerate hook
- given a prompt and model it will respond with
- the content of the response
- the usage of the response
- the id of response to get more info on inference - such as tokens, latency, model name
*/

import { useOpenRouterGenerate } from "~/hooks/useOpenRouterGenerate" 
import MarkdownItRenderer from "./MarkDown";

function jsonArray2Content(allJSON) {
    let content=''
    const idSet = new Set();
    for (const j of allJSON) { 
        try {
        content += j.choices[0].delta.content
        idSet.add(j.id);
        } catch (error) {
            console.log("jsonArray2Content: Error while parsing ",j);
            
        }
    }
    const idArray = Array.from(idSet);
    return [content,idArray];
  }



export default function Generate({prompt,model,task}) {

    if (!model || !prompt) return <div>No model or prompt</div>

    const data = useOpenRouterGenerate(
        prompt,
        model,
        task
    )

    const [content,idArray] = jsonArray2Content(data);
    const usage = data[data.length-1]?.usage

    return (
        <div>
            <pre className="font-thin text-xs">{JSON.stringify(idArray)}</pre>
            <pre className="font-thin text-xs">{JSON.stringify(usage)}</pre>
            
            <div className="p-10 font-thin">
                <MarkdownItRenderer markdown={content} className={""}></MarkdownItRenderer>
            </div>
        </div>
        )

} 
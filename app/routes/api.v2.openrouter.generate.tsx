//
// Get all model details on openrouter
//

import { useActionData } from "@remix-run/react";
import { useState} from "react"
//import { useOpenRouterGenerate } from "~/hooks/useOpenRouterGenerate";
import { getFormData,  } from "~/helpers/webUtils.server";
import Generate from "../components/Generate";
//import MarkdownItRenderer from "~/components/MarkDown";
import SearchSelect from "~/components/SearchAndSelect";
import Model from "~/components/Model";
//import Graph from "~/components/Graph2";
//import CommandCopy from "~/components/CommandCopy";
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
    //const data = useOpenRouterGenerate(prompt,model,task,false);
    //const [submitted,setSubmitted]=useState(false);
    const [selectedTask,setSelectedTask]=useState('');
    const [selectedModel,setSelectedModel]=useState('');
    // const options = [
    //     'analyse_patent',
    //     'assist_distance_runner',
    //     'clear_text',
    //     'explain_docs',
    //     'extract_ideas',
    //     'find_hidden_message',
    //     'to_flashcards',
    //     'summarise',
    //     'summarise_inshort',
    //     'summarise_paper',       
    // ]
    // const models = [
    //     'google/gemini-flash-1.5-8b-exp',
    //     'meta-llama/llama-3.2-11b-vision-instruct:free',
    //     'mistralai/codestral-mamba',
    //     'mistralai/mistral-7b-instruct:free',
    //     'openai/gpt-4o-2024-08-06',
    //     'openai/gpt-4o-mini-2024-07-18',
    //     'openai/gpt-4o-mini',
    // ]
// function jsonArray2Content(allJSON) {
//     let content=''
//     const idSet = new Set();
//     for (const j of allJSON) { 
//         try {
//         content += j.choices[0]?.delta.content
//         idSet.add(j.id);
//         } catch(e) {
//             console.log("Error: jsonArray2Content: ",j)
//         }
//     }
//     return [content,idSet];
//   }

// const handleSelectTask = (selectedOption) => {
//     //console.log("Selected Option: ",selectedOption);
//     setSelectedTask(selectedOption);
// }
// const handleSelectModel = (selectedOption) => {
//     //console.log("Selected Option: ",selectedOption);
//     setSelectedModel(selectedOption);
// }
/// form submit handler
    // const handleSubmit = () => {
    // setSubmitted(true);
    // }
///

    //const [content,idSet] = jsonArray2Content(data);
    //const idArray = Array.from(idSet);
    console.log("generate : ",selectedTask,selectedModel);

    return (
        <div>
           {/* <form method="POST" className="p-10 space-y-2 flex flex-col items-center" onSubmit={handleSubmit} >
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
                    value={selectedModel?selectedModel:""}
                    hidden
                    readOnly
                    className="input input-bordered input-primary w-full max-w-xs" />
            <input
                    name="task"
                    type="text"
                    //onChange={handleInputChange}
                    placeholder="task"
                    value={selectedTask?selectedTask:""}
                    hidden
                    readOnly
                    className="input input-bordered input-primary w-full max-w-xs" /> 
            <SearchSelect options={options}  onSelect={handleSelectTask}></SearchSelect>
            <SearchSelect options={models}  onSelect={handleSelectModel}></SearchSelect>
            <button type="submit" className="btn btn-sm">Submit</button>
            </form> 
            */}
        <div className="text-xs font-thin text-blue-600">
            
            <div className="mx-4 p-4 bg-gray-100 rounded-lg">
            <Generate model={model} prompt={prompt} task={task}></Generate>
            </div>
            
        </div>
            <Generate model={"liquid/lfm-40b:free"} prompt={prompt} task={task}></Generate>
            <Model/>
            <div className="mx-4 p-4 bg-gray-100 rounded-lg">
               {/*<Graph/>*/}
            </div>
        </div>
    )
    
}
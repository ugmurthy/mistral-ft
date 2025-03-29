import Response  from "../components/Response";
import {useLoaderData} from "@remix-run/react";
import {getSearchParamsAsJson} from "~/helpers/webUtils.server";
import db from "../module/xata.server";
import StreamDisplay from "~/components/StreamDisplay";

export const loader = async ({request}) => {
    const {prompt,task} =  getSearchParamsAsJson(request);
    let tasks = await db.getTasks();
    return {prompt,task,tasks};
}

export default function Component() {
    const {prompt,tasks} = useLoaderData();
    //const model = "llama3.2:latest";
    //const model = "google/gemini-2.0-flash-thinking-exp:free"
    const model = "gemma3:12b"
    return (
        <div>
            <hr></hr>
        {/*<Response prompt="Create a python script to download a file from a url" model={model} task="download_file" debug={true} />*/}
        <StreamDisplay prompt={prompt} model={model} task="download_file" />
            <hr></hr>
        <div className="p-4 text-xs text-blue-700 font-thin">
            <pre>{"prompt : "} {prompt}</pre>
            <pre>{"model  : "} {model}</pre>
        </div>
         </div>
    );  
}
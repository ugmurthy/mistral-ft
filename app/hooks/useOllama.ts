import {useState, useEffect, useRef} from 'react';
import {createEventSource} from "eventsource-client";


/* Generate streaming response
{"model":"llama3.2:latest","created_at":"2025-03-27T23:37:42.966366Z","response":"!","done":false}
{"model":"llama3.2:latest","created_at":"2025-03-27T23:37:42.979691Z","response":"","done":true,"done_reason":"stop",
  "context":[128006,9125,128007,271,38766,1303,33025,2696,25,6790,220,2366,18,271,2675,527,264,1917,538,51273,28275,
    128009,128006,882,128007,271,32215,264,6913,3197,311,1629,264,220,20,74,304,220,19,5672,128009,128006,78191,128007,
    ....
    4510,304,6261,13,1472,3077,2751,420,0],
    "total_duration":7903446208,
    "load_duration":437984625,
    "prompt_eval_count":46,
    "prompt_eval_duration":761547708,
    "eval_count":524,
    "eval_duration":6703435250}
*/

/* Chat streaming response
{"model":"llama3.2:latest","created_at":"2025-03-27T23:44:02.00831Z","message":{"role":"assistant","content":"!"},"done":false}
{"model":"llama3.2:latest","created_at":"2025-03-27T23:44:02.022326Z","message":{"role":"assistant","content":""},
"done_reason":"stop","done":true,
"total_duration":10645025208,
"load_duration":439365875,
"prompt_eval_count":46,
"prompt_eval_duration":146686708,
"eval_count":771,
"eval_duration":10058425625}
*/
export function chatStream2Content(data) {
    //tokens/second = eval_count / eval_duration * 10^9.
    var content = ""
    const stats={}
    for (const d of data) {
      if (!d.done) {
        content += d.message.content
      } else {
        stats.done_reason = d.done_reason
        stats.total_duration = d.total_duration
        stats.load_duration = d.load_duration
        stats.prompt_eval_count = d.prompt_eval_count
        stats.prompt_eval_duration = d.prompt_eval_duration
        stats.eval_count = d.eval_count
        stats.eval_duration = d.eval_duration
      } 
    }
    return {content,stats}
  }
/* function jsonArray2Content(allJSON) {
    let content=''
    const idSet = new Set();
    for (const j of allJSON) { 
        if (j.hasOwnProperty('error')) {
            console.log("Error: jsonArray2Content: ",j.error)
            content += `\nError: ${j.error.message}: ${j.code}`;
            continue;
        }
        try {
        content += j.choices[0]?.delta.content
        idSet.add(j.id);
        } catch(e) {
            console.log("Error: jsonArray2Content: ",j)
        }
    }
    const usage=allJSON[allJSON.length-1]?.usage;
    const idArray = Array.from(idSet);
    return [content,idArray,usage];
}
 */
export const useOllama = (prompt:string, model:string, task:string="", debug=false) => {
    
    const [data, setData] = useState([]);
    const [error,setError]=useState(null);
    const esRef = useRef(null);
    const BASE_URL = '/api/v1/ollama'

        useEffect(() => {
        // if any of prompt or model is "" or null or undefined    
        if ( !prompt || !model ) return;
        /*
        headers: {
                Accept: 'text/event-stream',
                "Content-Type": 'application/x-ndjson'
            },
        */
        debug && console.log("useOllama: ",BASE_URL, model, prompt.slice(0,50)+'...');
        if (!esRef.current) { // prevent second call
            debug && console.log("useEffect: useOllama: Creating EventSource...")
            esRef.current = createEventSource({
            url: BASE_URL,
            
            method: 'POST',
            body: JSON.stringify({
                prompt: prompt,
                model: model,
                task:task,
            }),
            onMessage: ({data,event,id}) => {
                debug &&  console.log(data,event,id)
                if (data.includes('[DONE]')) {
                    debug && console.log("useEffect: OpenRouterGenerate: [DONE] Closing EventSource...")
                    esRef.current.close();
                } else {
                    try {
                        const chunk = JSON.parse(data);
                        if (chunk.hasOwnProperty('error')) {
                            console.log("useEffect: OpenRouterGenerate: Error: ",chunk.error)
                            //12/Nov/24 - store error message to data so that it can be displayed to user
                            setError(chunk);
                            esRef.current.close();
                            //12/Nov/24 
                            //return ;
                        }
                        debug && console.log(chunk.id, chunk.choices[0].delta.content);
                        setData(prevData => [...prevData, chunk]);
                    } catch(e) {
                        debug && console.log(`Error: EventSource: While Parsing : ${data} `,e)
                        debug && console.log("Closing connection")
                        esRef.current.close();
                    }
                }
            },
            
                });
            
        }

        return () => { // teardown EventSource to cleanup: DONT DO it as it will invoke another Event Source
                // Do nothing as it will invoke another Event Source
                // the closure is done at end of stream 
                esRef.current.close();
                esRef.current = null;
                console.log("useEffect: useOllama...teardown...")
        }
        
    },[]) // run once

    //onst [content,idArray,usage] = jsonArray2Content(data);
    return [data,error];
    //return data;
}            

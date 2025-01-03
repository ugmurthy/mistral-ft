import {useState, useEffect, useRef} from 'react';
import {createEventSource} from "eventsource-client";

function jsonArray2Content(allJSON) {
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

export const useOpenRouterGenerate = (prompt:string, model:string, task:string="", debug=false) => {
    const [data, setData] = useState([]);
    const [error,setError]=useState(null);
    const esRef = useRef(null);

        useEffect(() => {
        // if any of prompt or model is "" or null or undefined    
        if ( !prompt || !model ) return;
        
        console.log("useOpenRouterGenerate: ",model, prompt.slice(0,50)+'...');
        if (!esRef.current) { // prevent second call
            esRef.current = createEventSource({
            url: `/chat_action`,
            headers: {
                Accept: 'text/event-stream',
            },
            method: 'POST',
            body: JSON.stringify({
                prompt: prompt,
                model: model,
                task:task,
            }),
            onMessage: ({data,event,id}) => {
                debug &&  console.log(event,id,data)
                if (data.includes('[DONE]')) {
                    console.log("useEffect: OpenRouterGenerate: [DONE] Closing EventSource...")
                    esRef.current.close();
                } else {
                    try {
                        const chunk = JSON.parse(data);
                        if (chunk.hasOwnProperty('error')) {
                            console.log("useEffect: OpenRouterGenerate: Error: ",chunk.error)
                            //12/Nov/24 - store error message to data so that it can be displayed to user
                            setError(error);
                            esRef.current.close();
                            //12/Nov/24 
                            //return ;
                        }
                        debug && console.log(chunk.id, chunk.choices[0].delta.content);
                        setData(prevData => [...prevData, chunk]);
                    } catch(e) {
                        console.log(`Error: EventSource: While Parsing : ${data} `,e)
                        console.log("Closing connection")
                        esRef.current.close();
                    }
                }
            },
            
                });
        }

        return () => { // teardown EventSource to cleanup: DONT DO it as it will invoke another Event Source
            if (esRef.current) {
                // Do nothing as it will invoke another Event Source
                // the closure is done at end of stream 
            }
        }
        
    },[]) // run once
//  },[prompt,model])  // run every time promp/model changes.
    const [content,idArray,usage] = jsonArray2Content(data);
    return [content,idArray,usage,error];
    //return data;
}            

import {useState, useEffect, useRef} from 'react';
import {createEventSource} from "eventsource-client";

export const useOpenRouterGenerate = (prompt:string, model:string, task:string="", debug=false) => {
    const [data, setData] = useState([]);
    const esRef = useRef(null);

        useEffect(() => {
        if ( !prompt || !model) return;
        debug && console.log("useOpenRouterGenerate: ",prompt,model);
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
                    console.log("useEffect: OpenRouterGenerate: We are all done! Closing EventSource...")
                    esRef.current.close();
                } else {
                    try {
                    const chunk = JSON.parse(data);
                    debug && console.log(chunk.id, chunk.choices[0].delta.content);
                    setData(prevData => [...prevData, chunk]);
                    //setText(prevTxt => prevTxt+chunk.choices[0].delta.content);
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
        
    },[prompt,model])

    return data;
}            

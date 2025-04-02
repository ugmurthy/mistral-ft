import {useState, useEffect, useRef} from 'react';


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

 export const useOllama = (prompt:string, model:string, task:string="", debug=false) => {
    
    const [messages, setMessages] = useState([]);
    const [error,setError]=useState(null);
    
    const abortControllerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const BASE_URL = '/api/v1/ollama'
    
    
    useEffect(() => {
        // Create abort controller for fetch
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;
        
        // Custom stream handling using fetch instead of EventSource
        const fetchStream = async () => {
          try {
            setIsConnected(true);
            const url = new URL(BASE_URL, window.location.origin);
            // if (prompt) url.searchParams.append('prompt', prompt);
            // if (model) url.searchParams.append('model', model);
            // if (task) url.searchParams.append('task', task);
            console.log("fetchStream url",url.toString());
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Accept': 'application/x-ndjson, application/json',
              },
              body: JSON.stringify({ prompt, model, task }),
              signal,
            });
    
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // Get the reader from the response body stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
    
            // Process the stream
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) {
                break;
              }
    
              // Decode the chunk and add it to our buffer
              buffer += decoder.decode(value, { stream: true });
              
              // Process any complete JSON objects in the buffer
              const lines = buffer.split('\n');
              
              // Keep the last line in the buffer if it's incomplete
              buffer = lines.pop() || '';
              
              // Process complete lines
              for (const line of lines) {
                if (line.trim() === '') continue;
                
                try {
                  const data = JSON.parse(line);
                  
                  setMessages((prevMessages) => {
                    // If this is a completion message (done: true)
                    if (data.done) {
                      return [...prevMessages, { ...data, type: 'completion' }];
                    }
                    
                    // Regular message with response text
                    return [...prevMessages, { ...data, type: 'message' }];
                  });
                } catch (err) {
                  console.error('Error parsing JSON line:', err, line);
                }
              }
            }
          } catch (err) {
            if (err?.name === 'AbortError') {
              console.log('Fetch aborted');
            } else {
              console.error('Stream error:', err);
              setError(`Connection error: ${err?.message}`);
              setIsConnected(false);
              
              // Try to reconnect after a delay
              setTimeout(fetchStream, 3000);
            }
          }
        };
    
        fetchStream();
    
        // Clean up the connection when component unmounts
        return () => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
          setIsConnected(false);
        };
      }, [prompt, model, task, BASE_URL]);

    //onst [content,idArray,usage] = jsonArray2Content(data);
    return [messages,error];
    //return data;
}            

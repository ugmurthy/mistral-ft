  
  import React, { useState, useEffect, useRef } from 'react';

const StreamDisplay = ({prompt,model,task}) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  const BASEURL = '/api/v1/ollama';
  
  // Automatically scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Create abort controller for fetch
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    // Custom stream handling using fetch instead of EventSource
    const fetchStream = async () => {
      try {
        // Build URL with query parameters
        const url = new URL(BASEURL, window.location.origin);
        if (prompt) url.searchParams.append('prompt', prompt);
        if (model) url.searchParams.append('model', model);
        if (task) url.searchParams.append('task', task);
        console.log("StreamDisplay: url",url);

        setIsConnected(true);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/x-ndjson, application/json',
          },
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
              console.log("StreamDisplay: data",data);
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
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Stream error:', err);
          setError(`Connection error: ${err.message}`);
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
  }, []);

  // Format the response text
  const formatResponse = (message) => {
    if (message.type === 'completion') {
      return (
        <div className="p-3 bg-gray-100 rounded-md mb-2 border border-gray-300">
          <div><strong>Model:</strong> {message.model}</div>
          <div><strong>Done Reason:</strong> {message.done_reason}</div>
          
          {message.total_duration && (
            <div className="mt-2">
              <div><strong>Total Duration:</strong> {(message.total_duration / 1000000).toFixed(2)}ms</div>
              <div><strong>Load Duration:</strong> {(message.load_duration / 1000000).toFixed(2)}ms</div>
              <div><strong>Eval Count:</strong> {message.eval_count}</div>
              <div><strong>Eval Duration:</strong> {(message.eval_duration / 1000000).toFixed(2)}ms</div>
            </div>
          )}
          
          {message.context && (
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-600">Context Tokens</summary>
              <div className="p-2 bg-gray-200 rounded mt-1 text-xs font-mono overflow-x-auto">
                {JSON.stringify(message.context)}
              </div>
            </details>
          )}
        </div>
      );
    } else {
      // Regular message with response text
      return (
        <span className="inline-block">
          {message.message.content}
        </span>
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4 flex items-center">
        <h2 className="text-xl font-bold">Stream Display</h2>
        <div className={`ml-4 h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="ml-2 text-sm text-gray-600">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="font-mono text-sm whitespace-pre-wrap">
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              {formatResponse(message)}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default StreamDisplay;
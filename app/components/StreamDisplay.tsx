import MarkdownItRenderer from './MarkDownIt';
import CommandCopy from './CommandCopy';
import DownLoadmd from './DownLoadmd';
import React, { useState, useEffect, useRef } from 'react';

const StreamDisplay = ({ prompt, model }) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Automatically scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset messages when prompt or model changes
  useEffect(() => {
    setMessages([]);
    setError(null);
    
    // If there's an active connection, abort it
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setIsConnected(false);
    setIsLoading(false);
  }, [prompt, model]);

  // Start streaming function
  const startStreaming = async () => {
    // Clear previous state
    setMessages([]);
    setError(null);
    setIsLoading(true);
    
    // Abort any existing connection
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    try {
      // Build URL with query parameters
      const url = new URL('/api/v1/ollama', window.location.origin);
      
      
      setIsConnected(true);
      console.log('Connecting to:', url.toString());
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Accept': 'application/x-ndjson, application/json',
        },
        body: JSON.stringify({ prompt, model }),
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
          setIsLoading(false);
          setIsConnected(false);
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
                setIsLoading(false);
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
      }
      setIsLoading(false);
      setIsConnected(false);
    }
  };

  // Abort streaming function
  const abortStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setIsConnected(false);
  };

  //console.log('Messages:', messages);
  
  let content = messages.map((message, index) => {
    if (message.type === 'completion') {
      // do not show the completions message for now
    } else {
      return message.message.content
    }
  })
   
  console.log('content:', content);
  content = content.join("");
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
        <span className="inline-block">{message.message.content} </span>
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">Stream Display</h2>
          <div className={`ml-4 h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="ml-2 text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="border rounded-lg p-4 bg-white shadow-sm">
        {prompt && model && (
          <div className="mb-4 p-3 bg-gray-100 rounded-md">
            <div><strong>Model:</strong> {model}</div>
            <div><strong>Prompt:</strong> {prompt}</div>
          </div>
        )}
        
        <div className="font-mono text-sm whitespace-pre-wrap">
          
          {/*messages.map((message, index) => (
            <React.Fragment key={index}>
              {formatResponse(message)}
            </React.Fragment>
          ))*/}
          <MarkdownItRenderer 
              markdown={content} 
              className="max-w-6xl mx-auto" // Additional Tailwind classes
              fontSize="text-lg"
              fontFamily="font-serif"
              textColor="text-blue-900"/>
              
                  <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="fixed  bottom-4 right-4">
          {!isLoading ? (
            <button
              onClick={startStreaming}
              className="btn btn-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              disabled={!prompt || !model}
            >
              Start Stream
            </button>
          ) : (
            <button
              onClick={abortStreaming}
              className="btn btn-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Abort Stream
            </button>
          )}
        </div>

    </div>
  );
};


export default StreamDisplay;
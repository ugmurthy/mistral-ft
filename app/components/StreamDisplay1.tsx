import React, { useState, useEffect, useRef } from 'react';

const StreamDisplay = ({prompt,model,task}) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef(null);
  const url = `/chat?prompt=${prompt}&model=${model}`;
  console.log("StreamDisplay: url",url);
  useEffect(() => {
    // Initialize EventSource
    const connectStream = () => {
      eventSourceRef.current = new EventSource(url);

      // Handle incoming messages
      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages((prev) => [...prev, data]);
        } catch (error) {
          console.error('Error parsing stream data:', error);
        }
      };

      // Handle connection opened
      eventSourceRef.current.onopen = () => {
        setIsConnected(true);
        console.log('Stream connection opened');
      };

      // Handle errors
      eventSourceRef.current.onerror = (error) => {
        setIsConnected(false);
        console.error('Stream error:', error);
        // Attempt to reconnect after 1 second
        setTimeout(connectStream, 1000);
      };
    };

    connectStream();

    // Cleanup on component unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log('Stream connection closed');
        setIsConnected(false);
        eventSourceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="stream-container">
      <h2>Stream Status: {isConnected ? 'Connected' : 'Disconnected'}</h2>
      
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <div className="message-header">
              <span>Model: {msg.model}</span>
              <span>Time: {new Date(msg.created_at).toLocaleTimeString()}</span>
            </div>
            <div className="message-content">
              <p>Response: {msg.response}</p>
              {msg.done && (
                <div className="message-stats">
                  <p>Done: {msg.done_reason}</p>
                  <p>Total Duration: {(msg.total_duration / 1000000).toFixed(2)}ms</p>
                  <p>Load Duration: {(msg.load_duration / 1000000).toFixed(2)}ms</p>
                  <p>Eval Count: {msg.eval_count}</p>
                  <p>Eval Duration: {(msg.eval_duration / 1000000).toFixed(2)}ms</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .stream-container {
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .messages {
          max-height: 500px;
          overflow-y: auto;
          border: 1px solid #ccc;
          padding: 10px;
          margin-top: 10px;
        }
        .message {
          border-bottom: 1px solid #eee;
          padding: 10px 0;
        }
        .message-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.9em;
          color: #666;
        }
        .message-content {
          margin-top: 5px;
        }
        .message-stats {
          font-size: 0.8em;
          color: #444;
          background: #f5f5f5;
          padding: 5px;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default StreamDisplay;

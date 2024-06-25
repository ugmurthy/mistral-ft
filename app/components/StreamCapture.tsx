import  { useState, useEffect } from 'react';

const TextStreamComponent = ({ url }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create a function to handle the streaming of text data
    let reader;
    const fetchTextStream = async () => {
      try {
        const response = await fetch(url);
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
         reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Process the stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const newText = decoder.decode(value, { stream: true });
          // Update the state with the new text chunk
          setText((prevText) => prevText + newText);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTextStream();

    // Cleanup function to abort the fetch if component unmounts
    return () => {
      if (reader && typeof reader.cancel === 'function') {
        reader.cancel();
      }
    };
  }, [url]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <div>{text}</div>;
};

export default TextStreamComponent;

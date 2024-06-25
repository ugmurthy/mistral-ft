import  { useState, useEffect } from 'react';
import _ from 'lodash'

const TextStreamComponent = ({ url }) => {
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function chunks2Array(chunk) {
    function getStr(c) {
      if (c!=="") return JSON.parse(c);
     }
    // return an array of json objects
    // check if chunk has json objects, remove non-json objects from string
    const retval = chunk.split('\n').map((c)=>c.substring(_.indexOf(c,"{"),_.lastIndexOf(c,"}")+1))
    //console.log(retval)
    if (retval[retval.length-1]==="") {
      retval.pop();
    }
    const objArray = retval.map(getStr)
    //console.log("Chunks2Array: ",objArray);
    return _.compact(objArray)
  }

  useEffect(() => {
    // Create a function to handle the streaming of text data
    let reader;
    let count=0;
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
          
          const chunk_json = chunks2Array(newText); // return array of json objects
          setText((prevText) => prevText + newText);
          //console.log("chunkjson :", chunk_json)
          //setData(prevData => [...prevData, ...chunk_json]);
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
  
  const jsonArray = chunks2Array(text);
  const textArray = jsonArray.map((a)=>a.choices[0].delta.content);
  const content = textArray.join('');
  return (
  
  <div>
    <div className='p-10'>{content}</div>
  </div>

)
  
};

export default TextStreamComponent;

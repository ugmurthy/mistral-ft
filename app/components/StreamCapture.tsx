// hook to capture stream


import  { useState, useEffect } from 'react';
import _ from 'lodash'

const TextStreamComponent = ({ url }) => {
  const [content, setContent] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  function chunks2JSON(chunks) {
    // arg0 : text chunk as received from data stream
    // returns array of json which could be empty
    // process chunks - could be multiline json text - the newlines could be anywhere
    //
    let lines = chunks.split("\n\n") 
    lines = _.compact(lines); 
    lines = _.flatten(lines);
    // now we are good to convert array of jsontext to json
    const linesJSON=[]

    for (const line of lines ) {
        try { // try parsing
            const start = _.indexOf(line,"{");
            const end = _.lastIndexOf(line,"}");
            const ljson = JSON.parse(line.substring(start,end+1))
            linesJSON.push(ljson);
        } catch(e) {
            console.log('Error:chunk2JSON: parsing chunk',line);
            
        }  
     }    
    
    return linesJSON
}

function jsonArray2Content(allJSON) {
  let content=''
  for (const j of allJSON) { content += j.choices[0].delta.content}
  return content;
}

useEffect(() => {
    const fetchData = async () => {
      
      if (url==="") return;
      //setDone(false);
      console.log("useEffect url ",url);
      const response = await fetch(url)
      if (response===null || response?.body===null) {
        console.log("Null response"); 
        return;
      }
      const reader = response.body.getReader();
      const readChunk = async () => {
        const { done, value } = await reader.read();
        if (done ) {
          //setDone(true);
          setLoading(false);
          console.log("useEffect Done!")
          return; 
        }
        const chunk = new TextDecoder().decode(value);
        const chunk_json = chunks2JSON(chunk); // return array of json objects
        setData(prevData => [...prevData, ...chunk_json]);
        readChunk(); // Call itself recursively to read the next chunk
      };

      readChunk();
    };

    fetchData();
  }, [url]);

  useEffect(()=>{
    setContent(jsonArray2Content(data))
  },[data])

if (loading) return <div>Loading...</div>

return (
    <div className='p-10'>
        <div>{content}</div>
        <div>{JSON.stringify(data)}</div>
    </div>
)
}

export default TextStreamComponent
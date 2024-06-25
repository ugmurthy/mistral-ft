// hook to capture stream


import  { useState, useEffect } from 'react';
import _ from 'lodash'

const TextStreamComponent = ({ url }) => {
  const [content, setContent] = useState('');
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
  function array2Content(data) {
        let result='';
        for (const chunk of data) {
            result = result + chunk.choices[0].delta.content;
        }
        return result
        
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
        const chunk_json = chunks2Array(chunk); // return array of json objects
        setData(prevData => [...prevData, ...chunk_json]);
        readChunk(); // Call itself recursively to read the next chunk
      };

      readChunk();
    };

    fetchData();
  }, [url]);

  useEffect(()=>{
    setContent(array2Content(data))
  },[data])

if (loading) return <div>Loading...</div>
if (error) return <div>Error</div>

return (
    <div className='p-10'>
        <div>{content}</div>
        <div>{JSON.stringify(data)}</div>
    </div>
)
}

export default TextStreamComponent
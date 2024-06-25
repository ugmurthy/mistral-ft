
import { useRef, useState } from 'react';

// eslint-disable-next-line react/prop-types
function Component({method="GET", className="bg-gray-100  outline-1 outline-slate-800" ,aiRole='Coach'}) {
    //console.log("Prompt ",method, persona, className)
  const [text,setText]=useState("");

  const formRef = useRef()
  function handleKeyPress(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      formRef.current.submit();
    }    
  }
  function handleChange(e) {
    setText(e.target.value)
  }
  return (
    <div className={className}>
      <form method={method} ref={formRef} >
      <input name="role" type="text" hidden defaultValue={aiRole} />
      <textarea 
         name="prompt" 
         placeholder={`Ask ${aiRole}...`}
         value={text} 
         className=" hover:outline hover:outline-2  p-2 shadow-2xl flex-grow fixed bottom-10 left-1/2 m-0 -translate-x-1/2 transform rounded-lg bg-slate-200 w-11/12 "
         onKeyUp={handleKeyPress}
         onChange={handleChange}>
      </textarea>
      
      </form>
     
    </div>

  )
}

export default Component

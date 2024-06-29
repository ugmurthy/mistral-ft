
import { useEffect, useRef, useState } from 'react';
import { cx } from '~/helpers/cx';

import { Form , useFetcher, useNavigation} from '@remix-run/react';

// eslint-disable-next-line react/prop-types
function Component({transition, method="get" ,aiRole='Coach'}) {
    //console.log("Prompt ",method, persona, className)
  const [text,setText]=useState("");
  const className = cx("bg-gray-50  outline-1 outline-slate-800")
  const formRef = useRef()


  function handleKeyPress(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      transition(true);
      formRef.current?.submit();
      //fetcher.submit();
    }    
  }
  function handleChange(e) {
    setText(e.target.value)
  }

  // use 'autoFocus' as one of the params in case you want the cursor to be position by default
  // I have not used it as it is not a good practice to do so.
  return (
    <div className={className}>
      <form method={method} ref={formRef} >
      <input name="role" type="text" hidden defaultValue={aiRole} />
    
      <textarea 
         name="prompt" 
         placeholder={`Ask ${aiRole}...`}
         value={text} 
         className=" hover:outline hover:outline-2  p-4 shadow-2xl flex-grow fixed bottom-10 left-1/2 m-0 -translate-x-1/2 transform rounded-lg bg-gray-100 w-11/12 "
         onKeyUp={handleKeyPress}
         onChange={handleChange}>
      </textarea>
      </form>
     
    </div>

  )
}

export default Component

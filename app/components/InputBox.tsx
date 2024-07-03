import  { useRef } from 'react';
import Up from './Up'

const MyForm = ({aiRole, allowEval}) => {
  const formRef = useRef(null);

  const handleFetch = () => {
    formRef.current.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    );
  };

const handleSubmit = (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        formRef.current?.submit();
      }    
  };
//className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-lg"
  return (
    <form
      ref={formRef}
      method="GET"
      className="p-2 shadow-2xl flex-grow fixed bottom-10 left-1/2 m-0 -translate-x-1/2 transform rounded-lg bg-gray-100 w-11/12 "
      
    >
      <input name="role" defaultValue={aiRole} hidden/>  
      <div >
      <div className="flex items-end space-x-2  justify-center">
      {allowEval
        ?<input 
          type="checkbox" 
          name="e_val" 
          className="tooltip tooltip-right tooltip-warning bg-neutral-300 checkbox checkbox-xs" 
          data-tip="Evaluate: Warning - when 'on' doubles the token usage as it shows responses from fine tuned model as well as original model" />
        :""
      }
      <textarea 
         name="prompt" 
         placeholder={`Ask ${aiRole}...`}
          
         className='hover:outline hover:outline-1 w-11/12 bg-gray-100 p-2 rounded-lg'
         onKeyUp={handleSubmit}
         >
      </textarea>
        <div onClick={handleFetch} className="flex items-center cursor-pointer h-full"><Up></Up></div>
        
      </div>
      </div>
    </form>
  );
};

export default MyForm;

// <textarea name="prompt" className="p-2 border border-gray-300 rounded w-8/12" />
//<input type="checkbox" name="e_val" className="tooltip checkbox checkbox-xs" data-tip="Evaluate: Warning - this double the token usage." />
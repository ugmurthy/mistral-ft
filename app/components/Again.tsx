import {useRef} from 'react';


function Again({prompt,aiRole}) {
const formRef = useRef();
const handleFetch = () => {
    formRef.current?.submit();
  }
const modified_prompt = prompt + " Please  provide details ";
  return (
    <form ref={formRef} method="GET" action="/coach">
        <input type="hidden" name="role" value={aiRole}></input>
        <input type="hidden" name="prompt" value={modified_prompt}></input>
        <button className="btn btn-xs btn-ghost opacity-50" onClick={handleFetch}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
        </button>
    </form>
  )
}

export default Again



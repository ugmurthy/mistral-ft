// app/routes/api.v2.mistral.tsx - RESOURCE ROUTE - so no component
// VERCEL Timeout
export const maxDuration = 50; // This function can run for a maximum of 50 seconds
// VERCEL

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { mistralChat} from "~/api/mistralAPI.server";


function getURLdetails(request:Request) {
	
  const url = new URL(request.url);
  if (url.pathname !== '/favicon.ico') { 
      const role = url.searchParams.get("role");
      const prompt= url.searchParams.get("prompt");
      const remember =url.searchParams.get("remember")
      const pers=url.searchParams.get("pers");
      const sys=url.searchParams.get("sys");
      return {prompt,role,remember,sys,pers}
  }
} 

export async function loader({ request }: LoaderFunctionArgs) {
  // needed this for debugging
  //const directory = process.env.VERCEL ? "/tmp/tmpdata" : "./public/tmpdata"
  //const fname = directory+"/allchunks.json"  // one element per chunk
 

const {prompt,role,remember,sys,pers} = getURLdetails(request);



if (role!=="Evaluate") {
  return json({result:{},sucess:false})
}

if (!(role && prompt)) {
  return json({result:"",sucess:false})
}
  ///
const evalPrompt=`
The following json object has 3 keys:
'question' ,'answer01', 'answer02'

Your Task:
Compare the answers in the json object
and give score  on a scale of 1 to 10 for each of the following parameter 

Relevance:  answers are relevant and address the 'question' .
Completeness:  answers cover the main benefits, but one of the answer  provides a bit more detail on challenges.
Clarity:  answers are clear and well-written.
Coherence: answers are logically structured.
Originality: answers provide unique points but are fairly similar in content.
Conciseness: answers cover the main points in the shortest number of words: use word count as a indicator. The answer using lower number of words scores higher
Rejection: answers indicate a inability to provide an answer example: I am not an exper...

Output Format:
The Output will be a JSON object indicating the scores for each answer
Also provide an aggregate score equally weight by all parameter
`

  const modifiedPrompt = evalPrompt +"\n"+prompt // ++  depending on what we expecting
  const user = [{role:"user",content:modifiedPrompt}]
   
  const messages = [...user]
  
  if (!process.env.MISTRAL_API_KEY) {
    console.log("Error: Missing API KEY!")
    throw new Response("Missing API Key",{ status: 401 })
  }
  // no streaming
  const response = await mistralChat(role,messages,false);
  const ret_val = await(response.json())
  console.log("/api/v2/score:  Got response ")
  
  const {answer01,answer02,aggregate_scores} = JSON.parse(ret_val.choices[0].message.content)
  const score = {"FineTunedModel":answer01,"BaseModel":answer02,aggregate_scores}
  return json({score});
}


function Component() {


  const score = useLoaderData();
  //console.log("Result : ",result)
  
    const handleClose = () => {
      window.close();
    };
  
  return (
    <div className="m-10 bg-slate-100 border border-1 rounded-lg">
     
      <div className="p-4 text-2xl font-bold flex  justify-between">
        

        {"Comparing Result of Fintuned Model  v/s Base Model"} 
        <span className="inline-block tooltip tooltip-top" data-tip="Close" onClick={handleClose}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
</svg></span>
        
        </div>
      <div className="p-4 text-sm font-thin ">
        <div>
          The comparision of answers from two models viz. Fine Tuned Model and Base Model is done 
          via task oriented prompt prefix to a the answers and question. 
          This then is sent to <pre className="font-semibold inline-block">mistral-large</pre> for inference for output in json-mode.
          This is still work in progress and improvements can be made. Next is explore function calling for this scoring task
        </div>
        <div className="text-red-500">Note: This is work in progress may breaks if the content presented is too large</div>
      </div>
      <pre className="px-20 py-4 font-thin text-sm bg-yellow-50">{JSON.stringify(score,null,2)}</pre>

    </div>
  )
}

export default Component
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

console.log(`remember ${remember}`);
console.log(`pers ${pers}`);
console.log(`sys ${sys}`);

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
Consiseness: answers cover the main points in the shortest number of words: use word count as a indicator
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
  console.log("/api/v2/score:  Got response ",JSON.stringify(ret_val,null,2))
  const {answer01,answer02,aggregate_scores} = JSON.parse(ret_val.choices[0].message.content)
  const score = {"FineTunedModel":answer01,"BaseModel":answer02,aggregate_scores}
  return json({score});
}


function Component() {


  const score = useLoaderData();
  //console.log("Result : ",result)
  
  return (
    <div className="p-10">
     
      <div className="text-2xl font-bold">{"Comparing Result of Fintune Model  v/s Base Model"} <Link className="text-blue-600 font-normal underline" to="/coach?role=Coach">Back</Link></div>
      <div className="text-xl font-thin text-red-500">
        Note: This is work in progress may break at times
      </div>
      <pre className="px-20 font-thin text-sm">{JSON.stringify(score,null,2)}</pre>

    </div>
  )
}

export default Component
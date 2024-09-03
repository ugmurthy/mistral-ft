
import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import {  useLoaderData, useRouteLoaderData } from "@remix-run/react";
import {json, redirect } from "@remix-run/node";
import {  useEffect,  useRef,  useState } from "react";
//import _ from "lodash";
import IconAndDisplay from "~/components/IconAndDisplay";
import InputBox from "~/components/InputBox";
import db from "../module/xata.server";
import { createConversationSession, getConversationSession, getFeaturesSession, requireUserId, setFeaturesSession } from "~/module/session/session.server";
import {  promptEvaluator } from "~/api/mistralAPI.server";
import Memory from "~/components/Memory";


function getURLdetails(request:Request) {	
    const url = new URL(request.url);
    if (url.pathname !== '/favicon.ico') { 
        const role = url.searchParams.get("role") || "";
        const prompt= url.searchParams.get("prompt") || "";
        const e_val =url.searchParams.get("e_val") || ""
        return {prompt,role,e_val}
}
} 

export const loader:LoaderFunction = async ({request}:LoaderFunctionArgs )=>{   
  const userId = await requireUserId(request);
  if (!userId) {  // if no user is logged in
      throw redirect("/login");
      }
  //parse the request to get prompt, role and evaluate
  let {prompt,role,e_val} = getURLdetails(request);
  console.log("/coach: role ",role)
  // evaluate the question and generate followup question
  const evaluation = prompt ? await promptEvaluator(prompt) : {};
  // features to use // work in progress
  // let myCoach = process.env.MYCOACH;
  // myCoach = myCoach?.replaceAll("\\","");
  // let features={}     
  // try {
  // features={...JSON.parse(myCoach)};
  // console.log("/coach: Parsed  RunGenie features...",features);
  // } catch(e){
  //   console.log("/coach: Error parsing features");
  //   // set defaults
  //   features={features:{evaluate:false,temperature:0.3,max_tokens:3000}}
  //   console.log("/coach: Feature Default(as fallback) ",features)
  // }
  
  // get conversation id from session
  let cId = await getConversationSession(request);
  const features = await getFeaturesSession(request);

  // @TODO - I dont like the following line - need better way to detect new conversation
  // Is this is a new conversation?
  // url ends with /coach&role=Coach  or cId is undefined => new conversation
  const urlAry=request.url.split("/")
  const newConversation = urlAry[urlAry.length-1]===`coach?role=${role}` || cId === undefined?true:false;
  if (newConversation) { 
    if (cId) {
      console.log("/coach: We already have a cId ",cId)
    } else {
      // create new conversation id
      cId = await db.addConversation({userId})
      console.log("/coach: New Conversation",cId)
    }
    
    
    const headers = await setFeaturesSession(features,request)
    console.log("/coach: role & prompt ",role,prompt)
    return json({role,prompt,e_val,cId,...features,evaluation},
      {headers: await createConversationSession(cId,request,headers)})
  } else {
    //console.log("/coach: Existing Conversation",cId)
    console.log("/coach: role & prompt ",role,prompt)
    return json({role,prompt,e_val,cId,...features,evaluation})
  }
    
}

function FollowUp({children}) {
  if (children) {
  return (
      <div className=" px-16 italic py-2 font-thin text-sm text-blue-500 tooltip tooltip-top" data-tip="Potential follow-up question">
          {children}
      </div>
    )  
  } else {return <></>}
}

export default function Component(){
const {user} = useRouteLoaderData("root");
const {role,prompt,e_val,cId,features,evaluation} = useLoaderData<typeof loader>(); 

//// Use the following code for fetcher.form in InputBox.tsx : does not work properly
/* const [loaderData,setLoaderData]=useState(null);
let role,prompt,e_val,cId,features,evaluation;
if (loaderData) {
  ({role,prompt,e_val,cId,features,evaluation} = loaderData)
  console.log("/coach: loaderData elements ",role,prompt,e_val,cId,features,evaluation)
} else {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  ({role,prompt,e_val,cId,features,evaluation} = useLoaderData())
  console.log("/coach null loaderData")
  console.log("/coach: USEloaderData elements ",role,prompt,e_val,cId,features,evaluation)
}
 */const followUpQuestion = evaluation?evaluation.followUp:"" ;

const [data,setData]= useState([]);
const [done,setDone]= useState(false); // indicates if inference is done
const [edata,setEdata]= useState([]); // indicates evaluation done
const [qaId,setQAid]= useState(null); // indicates question/answer written to qas table.
const [conversation,setConversation]=useState([]);
const [conversationId,setConversationId]=useState(cId);  // conversation id
const bottomRef = useRef<HTMLDivElement>(null);
//// Evaluation SCORE
const [score,setScore]=useState("");
const [evalDone,setEvalDone]=useState(false);
//console.log("Features ",features)
const allowEval=features?features.evaluate:false;
const url = `/api/v2/mistral?prompt=${prompt}&role=${role}`
//console.log(`Role:${role},prompt:${prompt}`);
const urlEval = `/api/v2/mistral?prompt=${prompt}&role=Original`
const evaluate=e_val?true:false

function jsonArray2Content(allJSON) {
  let content=''
  for (const j of allJSON) { content += j.choices[0].delta.content}
  return content;
}
function getStats(lastJSON){
    // input last JSON from server
    // openai api format
    try {
    const p = lastJSON?.usage.prompt_tokens
    const t = lastJSON?.usage.total_tokens
    const c = lastJSON?.usage.completion_tokens;
    const m = model(lastJSON?.model)
    return {prompt:p, response: c,total: t,model:m}
    } catch(e) {
      return {}
    }
}  
function model(m) {
  const details = m.split(":");
  if (details.length<6) {
    return {original:details[0]}
  } else {
    return     {fineTunedModel:details[4]}
  }
}
 const content= jsonArray2Content(data)
 const stats = getStats(data[data.length-1])

 // eval content
 const estats = getStats(edata[edata.length-1])
 const eContent = jsonArray2Content(edata)
 
 
// change in conversation useEffect
// reset converation when cId changes
useEffect(() => {
  async function getMemory() {
    const urlMemory = "/api/v2/memory"
    const ret_val = await fetch(urlMemory);
    const ret_val_json = await ret_val.json();
    console.log("0. useEffect getMemory: ",ret_val_json?.memory.len)
    setConversation(ret_val_json.memory);
  }
  //if (prompt) {
    getMemory();
  //}


},[]) // run once on load


// Inference UseEffect
useEffect(() => {
  const scrollBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  if (prompt) {
    setScore("")
    const eventSource = new EventSource(url);
    eventSource.onmessage = event => {

      //setChunks(prevData => [...prevData, event.data]);
      if (event.data.includes('[DONE]')) {
        //console.log("useEffect: Coach:FINETUNED We are all done! Closing EventSource...")
        setDone(true);
        eventSource.close();
      } else {
        setData(prevData => [...prevData, JSON.parse(event.data)]);
      } 
      scrollBottom();
    };

    eventSource.onerror = error => {
      //console.log("Error ",error);
      eventSource.close()
    }

    return () => {
      eventSource.close();
    };
  }
}, [prompt,role]);

// Evaluate UseEffect
useEffect(() => {
  if (prompt && evaluate) {
    console.log("Evaluating")
    const eventSource = new EventSource(urlEval);
    eventSource.onmessage = event => {
      //setChunks(prevData => [...prevData, event.data]);
      if (event.data.includes('[DONE]')) {
        //console.log("useEffect: Coach:ORIGINAL We are all done! Closing EventSource...")
        setEvalDone(true)
        eventSource.close();
      } else {
        setEdata(prevData => [...prevData, JSON.parse(event.data)]);
      } 
    };

    eventSource.onerror = error => {
      console.log("Error ",error);
      eventSource.close()
    }

    return () => {
      eventSource.close();
    };
  }
}, [prompt,role]);

///// SCORING useEffect
useEffect(() => {

  if (!evalDone || !done) return; /// don't do anything if either ft model or basemodel has completely responded

  async function fetchScore() {
    //1 Assemble json structure for scoring from prompt, content, econtent
    //  
    const jsonQA = {question:prompt, answer01:content, answer02:content}

    const urlScore = `/score?prompt=${JSON.stringify(jsonQA)}&role=Evaluate`
    //console.log("URL ",urlScore);
    //const response = await fetch(urlScore); // returns json with score
    //console.log(response)
    setScore(urlScore);
    }
  // looks like we have an evaluation to do 
  if (evalDone && done) {
    fetchScore();
    return () => {
     console.log("Scoring done!")
    };
  }
}, [evalDone, done]);
///// SCORING useEffect



//// Write questions to db on xata.io
useEffect(() => {
  console.log(`2. UseEffect QA : [${cId}]`)
  async function writeQuestion() {
    const jsonQA = {question:prompt, 
                    answer:content, 
                    stats:JSON.stringify(stats), userId:user.id,cId}
                   // userId:"rec_cqahbpi4br5n82p6r7c0"}
    
    /// 1. Write to xata.io table qas via formData
      // 1.1. Create formData
      const formData = new FormData();
      // 1.2. Append data to formData
      for (const key in jsonQA) { // jsonQA is the object containing the data to be sent
        formData.append(key, jsonQA[key]);
        //console.log("Key ",key," Value ",key==="userId"?jsonQA[key]:"--");
        }
        // 1.3. Send formData to server
        const urlInsertQA = `/api/v2/addQA`

        // 1.4. Send formData to server
        const ret_val = await fetch(urlInsertQA, { 
          method: 'POST',
           body: formData,
         });
        // 1.5. Log response
        const ret_val_json = await ret_val.json();
        //console.log("Retval : QA insert :", await ret_val_json.id);
        // there will be an error in dev mode as QA are not written to qas table
        const qaId = ret_val_json.id;
        setQAid(qaId);
        //const newConversation = [prompt,content,qaId,cId]
        //console.log("/coach: Component: memory len: ",memory.length)
        //setConversation(memory) // update Array of conversations 
    }
  if (done) {
    console.log("2. UseEffect Writing to db") 
    writeQuestion();
    //return () => {
    // console.log("Writing done!")
    //};
  }
}, [ done]);
////

/// REST conversation Array.
useEffect(() => {
  console.log(`3. UseEffect Conversation [${cId}] [${conversationId}]`)
  if (conversationId!==cId) {
    setConversation([]);
    setConversationId(cId);
    console.log("Coach component:RESET ARRAY:")
  }
},[conversationId,cId])

if (prompt===""||typeof prompt === 'undefined') {
  return (
    <InputBox aiRole={role} allowEval={allowEval} ></InputBox>
  )
}

if (content) {
  console.log("Coach component: qaId: ",qaId)
  return (
  <div className="flex flex-col justify-center pt-20 pb-4">
     
      <Memory memory={conversation} qaId={qaId} stats={stats} user={user}></Memory>
      <IconAndDisplay prompt={prompt} content="" stats={stats} user={user} />
      <IconAndDisplay content={content} prompt={prompt} stats={stats} qaId={qaId}/>
      {done && <FollowUp>{followUpQuestion}</FollowUp>}
       
      <div className="pt-32 " ></div>
      <InputBox aiRole={role} allowEval={allowEval}></InputBox>
      <div ref={bottomRef} className="text-xs text-center font-thin">RunGenie can make mistakes. Check before using it</div>
  </div>

  )
}  
}

//   <InputBox aiRole={role} fetcher={fetcher} allowEval={allowEval}></InputBox>
// removed evaluation logic from component on 15/Aug/2024
// {eContent?<IconAndDisplay content={eContent} prompt="" stats={estats} evaluate={evaluate}/>:""}
/*
{score
        ? <div className="flex justify-center">
      <Link 
      className="px-4 text-center underline bg-orange-300 text-blue-700 rounded-md" to={score} 
      target="_blank" rel="noopener noreferrer"
       >
        See Comparative Scores  : Fails sometimes </Link>
        </div>
        : ""
      }

// followup question
      {done && evaluation.followUp
            ?<div className=" px-16 italic py-2 font-thin text-sm text-blue-500 tooltip tooltip-top" data-tip="Potential follow-up question">
                  {followUpQuestion}
             </div>
            :""}
*/
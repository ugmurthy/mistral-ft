
import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import {  Link, useLoaderData, useRouteLoaderData } from "@remix-run/react";
//import Prompt from '../other_files/Prompt'
import {redirect } from "@remix-run/node";
//import db from "../module/xata.server"
import {  useEffect, useState } from "react";
//import _ from "lodash";
import IconAndDisplay from "~/components/IconAndDisplay";
import InputBox from "~/components/InputBox";

import { requireUserId } from "~/module/session/session.server";
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
  console.log("Loader route /coach :user Authenticated: ",userId);
  
  const {prompt,role,e_val} = getURLdetails(request);
    let myCoach = process.env.MYCOACH;
    
    let features={}     
    try {
    features={...JSON.parse(myCoach)};
    console.log("Parsed  RunGenie features...",features);
    } catch(e){
      console.log("\tError parsing features");
      // set defaults
      features={features:{evaluate:false,temperature:0.3,max_tokens:3000}}
      console.log("Feature Default(as fallback) ",features)
    }
    
    /* if (!(role && prompt)) {
      return({role:"",prompt:""})
    } */

    
    return {role,prompt,e_val,...features}
}

export default function Component(){
const {user} = useRouteLoaderData("root");
//const {rpnt} = useRouteLoaderData("route");
//console.log("User: ",user.name);
//console.log("RPNT: ",rpnt);
const {role,prompt,e_val,features} = useLoaderData<typeof loader>(); 
const [data,setData]= useState([]);
const [done,setDone]= useState(false); // indicates if inference is done
const [edata,setEdata]= useState([]); // indicates evaluation done
const [qaId,setQAid]= useState(null); // indicates evaluation done
//// Evaluation SCORE
const [score,setScore]=useState("");
const [evalDone,setEvalDone]=useState(false);
//console.log("Features ",features)
const allowEval=features.evaluate;

//// Evaluation
//const [chunks,setChunks]=useState([]);
//const [isInfering,setIsInfering]=useState(false)

const url = `/api/v2/mistral?prompt=${prompt}&role=${role}`
//console.log(`Role:${role},prompt:${prompt}`);
const urlEval = `/api/v2/mistral?prompt=${prompt}&role=Original`

const evaluate=e_val?true:false
//console.log("Evaluating? ",evaluate)
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
 

///
useEffect(() => {
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
  async function writeQuestion() {
    const jsonQA = {question:prompt, 
                    answer:content, 
                    stats:JSON.stringify(stats), userId:user.id}
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
        setQAid(ret_val_json.id);
    }
  if ( done) {
    //console.log("Writing to db") 
    writeQuestion();
    return () => {
    // console.log("Writing done!")
    };
  }
}, [ done]);
////



if (prompt==="") {
  return (
    <InputBox aiRole={role} allowEval={allowEval}/>
  )
}

if (content) {
  return (
  <div className="flex flex-col justify-center">
      <IconAndDisplay prompt={prompt} content="" stats={stats} user={user} />
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

      <IconAndDisplay content={content} prompt={prompt} stats={stats} qaId={qaId}/>
      {eContent?<IconAndDisplay content={eContent} prompt="" stats={estats} evaluate={evaluate}/>:""}

      <div className="pt-32"></div>
      <InputBox aiRole={role} allowEval={allowEval}></InputBox>
      
  </div>)
}  
}

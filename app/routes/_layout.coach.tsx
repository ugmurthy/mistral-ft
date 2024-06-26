
import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import {  Link, useLoaderData } from "@remix-run/react";
//import Prompt from '../other_files/Prompt'

import {  useEffect, useState } from "react";
//import _ from "lodash";
import IconAndDisplay from "~/components/IconAndDisplay";
import InputBox from "~/components/InputBox";
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
    const {prompt,role,e_val} = getURLdetails(request);
    
    /* if (!(role && prompt)) {
      return({role:"",prompt:""})
    } */

    
    return {role,prompt,e_val}
}

export default function Component(){
const {role,prompt,e_val} = useLoaderData<typeof loader>(); 
const [data,setData]= useState([]);
const [edata,setEdata]= useState([]);
//// Evaluation SCORE
const [score,setScore]=useState("");
const [evalDone,setEvalDone]=useState(false);
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
        console.log("useEffect: Coach:FINETUNED We are all done! Closing EventSource...")
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
        console.log("useEffect: Coach:ORIGINAL We are all done! Closing EventSource...")
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

  if (!evalDone) return; /// don't do anything

  async function fetchScore() {
    //1 Assemble json structure for scoring from prompt, content, econtent
    //  
    const jsonQA = {question:prompt, answer01:content, answer02:content}

    const urlScore = `/score?prompt=${JSON.stringify(jsonQA)}&role=Evaluate`
    console.log("URL ",urlScore);
    //const response = await fetch(urlScore); // returns json with score
    //console.log(response)
    setScore(urlScore);
    }
  // looks like we have an evaluation to do 
  if (evalDone) {
    fetchScore();
    return () => {
     console.log("Scoring done!")
    };
  }
}, [evalDone]);
///// SCORING useEffect
if (prompt==="") {
  return (
    <InputBox aiRole={role}/>
  )
}

if (content) {
  return (
  <div className="flex flex-col justify-center">
      <IconAndDisplay prompt={prompt} content="" stats={stats}/>
      {score?<Link 
      className="text-center underline bg-orange-300 text-blue-700 rounded-md" to={score} >
        See Comparative Scores  : Fails sometimes </Link>:""}
      <IconAndDisplay content={content} prompt="" stats={stats}/>
      {eContent?<IconAndDisplay content={eContent} prompt="" stats={estats} evaluate={evaluate}/>:""}

      <div className="pt-32"></div>
      <InputBox aiRole={role}></InputBox>
      
  </div>)
}  
}

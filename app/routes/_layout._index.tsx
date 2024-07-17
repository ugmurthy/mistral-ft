import {validToken} from "../module/sessions.server"
import {redirect} from "@remix-run/node"
//import type { MetaFunction } from "@remix-run/node";
import FixedCard from "~/components/FixedCard";
import InputBox from "~/components/InputBox";
import {pnt,randomSplit} from "../module/questions.server"
import { useLoaderData } from "@remix-run/react";
/* export const meta: MetaFunction = () => {
  return [
    { title: "My Coach" },
    { name: "description", content: "AI Based Running Coach for personal use" },
  ];
};
 */

export async function loader({request}) {
  const user = await validToken(request);
  if (!user) {
    throw redirect("/login");
  }
  const [ignore,rpnt] = randomSplit(pnt,4);
  console.log("Index Loader:user Authenticated ",user.name, ((user.exp-Date.now())/1000/60/60).toFixed(2),"hours left");
  return {rpnt};
}


export default function Index() {
/* 
  const pnt = [
    {
      "prompt": "I am a newbie and looking help, How can you help?",
      "title": "Seek Help!"
    },
    {
      "prompt": "Give me a weekly plan for lower body strength training formatted as a table",
      "title": "Training Plan"
    },
    {
      "prompt": "What impact does iron deficiency have on running?",
      "title": "Nutrition"
    },
    {
      "prompt": "Explain theory of Relativity",
      "title": "Off Topic"
    },
    
  ]
   */
  const {rpnt}=useLoaderData()
  const fixedCards = rpnt.map((c,i)=>{
    const url = `/coach?prompt=${c.prompt}&role=Coach`;
    return <FixedCard key={i} content={c.prompt} title={c.title} url={url}></FixedCard>
  })
  
  return (
    <div className="container mx-auto  px-4 ">
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div className="flex justify-center">
      <img src="AI_Coach.png" width="120" height="120" alt="Ai Coach"/>
      </div>
      <div className="opacity-70 pb-3 text-xl font-bold flex justify-center">AI based Assistant for Recreational Runners</div>
      
      <div className="flex flex-wrap justify-center gap-4">
      {fixedCards}
      </div>
      <div className="pb-28"></div>
      <InputBox aiRole={""} allowEval={""}></InputBox>
      
      </div>
    
    </div>
  );
}

/*
<div className="pt-10">
      <Disclaimer></Disclaimer>
      </div>
*/
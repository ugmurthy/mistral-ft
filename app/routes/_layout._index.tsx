//import type { MetaFunction } from "@remix-run/node";
import Disclaimer from "~/components/Disclaimer";
import FixedCard from "~/components/FixedCard";
/* export const meta: MetaFunction = () => {
  return [
    { title: "My Coach" },
    { name: "description", content: "AI Based Running Coach for personal use" },
  ];
};
 */
export default function Index() {

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
      "prompt": "I had a bad track workout today. Pep me up",
      "title": "Motivation"
    },
    
  ]
  
  const fixedCards = pnt.map((c,i)=>{
    const url = `/coach?prompt=${c.prompt}&role=Coach`;
    return <FixedCard key={i} content={c.prompt} title={c.title} url={url}></FixedCard>
  })
  
  return (
    <div className="container mx-auto  px-4 ">
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div className="flex justify-center">
      <img src="AI_Coach.png" width="120" height="120" alt="Ai Coach"/>
      </div>
      <div className="opacity-70 pb-3 text-xl font-bold flex justify-center"><span className="font-bold text-orange-500 pr-2">Mistral AI_</span> based Coach for Recreational Runners</div>
      
      <div className="flex flex-wrap justify-center gap-4">
      {fixedCards}
      </div>

      <div className="pt-10">
      <Disclaimer></Disclaimer>
      </div>
      </div>
    
    </div>
  );
}

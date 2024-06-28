import type { MetaFunction } from "@remix-run/node";
import Disclaimer from "~/components/Disclaimer";
import FixedCard from "~/components/FixedCard";
export const meta: MetaFunction = () => {
  return [
    { title: "My Coach" },
    { name: "description", content: "AI Based Running Coach for personal use" },
  ];
};

export default function Index() {

  const prompts=[
    "I am a newbie and looking help, How can you help?",
    "What are the benefits of strenght training for runners?",
    "What impact does iron deficiency have on running?",
    "I had a bad track workout today. Pep me up",
    "Explain Sun's role in the Solar System"
  ]
  return (
    <div className="container mx-auto  px-4 ">
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div className="flex justify-center">
      <img src="AI_Coach.png" width="120" height="120" alt="Ai Coach"/>
      </div>
      <div className="opacity-70 pb-3 text-xl font-bold flex justify-center">AI based Coach for Recreational Runners</div>
      
      <div className="flex flex-wrap justify-center gap-4">
      <FixedCard content={prompts[0]} title={"Seek Help!"} url={`/askm?prompt=${prompts[0]}&role=Coach`}></FixedCard>
      <FixedCard content={prompts[1]} title={"Know more"} url={`/askm?prompt=${prompts[1]}&role=Coach`}></FixedCard>
      <FixedCard content={prompts[2]} title={"Nutrition"} url={`/askm?prompt=${prompts[2]}&role=Coach`}></FixedCard>
      <FixedCard content={prompts[3]} title={"Movtivation"} url={`/askm?prompt=${prompts[3]}&role=Coach`}></FixedCard>
      <FixedCard content={prompts[4]} title={"A Googly!"} url={`/askm?prompt=${prompts[4]}&role=Coach`}></FixedCard>
      </div>

      <div className="pt-10">
      <Disclaimer></Disclaimer>
      </div>
      </div>
    
    </div>
  );
}

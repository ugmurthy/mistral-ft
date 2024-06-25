import type { MetaFunction } from "@remix-run/node";
import { Link } from "lucide-react";
import Disclaimer from "~/components/Disclaimer";
import Prompt from "~/components/Prompt";
import PromptCard from "~/components/PromptCard";

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
    "I had a bad track workout today. Pep me up"]
  return (
    <div className="container mx-auto  px-4 ">
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div className="flex justify-center">
      <img src="AI_Coach.png" width="150" height="150" alt="Ai Coach"/>
      </div>
      <div className="text-xl font-bold flex justify-center">AI based Coach for Recreational Runners</div>
      <div className="flex flex-wrap justify-center gap-4">
      <PromptCard cardText={prompts[0]} cardTitle={"Seek Help!"} url={`/askm?prompt=${prompts[0]}&role=Coach`}></PromptCard>
      <PromptCard cardText={prompts[1]} cardTitle={"Know more"} url={`/askm?prompt=${prompts[1]}&role=Coach`}></PromptCard>
      <PromptCard cardText={prompts[2]} cardTitle={"Nutrition"} url={`/askm?prompt=${prompts[2]}&role=Coach`}></PromptCard>
      <PromptCard cardText={prompts[3]} cardTitle={"Movtivation"} url={`/askm?prompt=${prompts[3]}&role=Coach`}></PromptCard>
      </div>
      
      <div className="pt-10">
      <Disclaimer></Disclaimer>
      </div>
      </div>
    
    </div>
  );
}

import { SerializeFrom } from "@remix-run/node";
import CommandCopy from './CommandCopy'
import MarkDown from "./MarkDown";

export default function ChatData ({data}:{data:SerializeFrom<string>[]}) {
    console.log("DATA :",data)
    //const content = data?.message.content
    const content = data?.choices[0].message.content;
    const usage = data?.usage
    console.log("Content ",content)
    console.log("type of ",typeof data);
    return (
    <div>  
      <div className="chat chat-end m-4">
        <div className="avatar chat-image">
          <div className="w-10  rounded-none ">
            <img src="/mistral.png" alt="mistral ai"/>
          </div>
        </div>
        <div className="chat-bubble"> <MarkDown markdown={content} className={"font-thin"}></MarkDown></div>
        <CommandCopy txt={content} btnTxt="Copy"></CommandCopy>
      </div>
      
      <pre className="text-sm font-thin">{JSON.stringify(usage,null,2)}</pre>
    </div>)
    
   }
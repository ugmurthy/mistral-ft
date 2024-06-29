import CommandCopy from "./CommandCopy";
import MarkDown from "./MarkDown";

export default function IconAndDisplay({content,prompt,stats}) {
    const tooltip = content?"mistral AI:"+JSON.stringify(stats):'Athlete' 
    const avatarClass = content
                            ? "bg-neutral-600 text-orange-500 w-10  rounded-full"
                            :"bg-neutral-600 text-blue-500 w-10  rounded-full"
    const text = content?content:prompt
    const textClass = content?"font text-sm":"font-semibold text-sm"
    const iconTxt = content?"M":"A"
    
    
    return (
        <div>
        <div className="relative flex items-start p-2  rounded-md "> 
        <div className="mr-3">
          <div className="avatar  placeholder tooltip tooltip-right" data-tip={tooltip}>
            <div className={avatarClass}>
                <span className="text-sm">{iconTxt}</span>
            </div>
          </div>
      </div>
  
      <div
          className="p-2 flex-grow resize-none focus:outline-none  border border-1  rounded-md"
        >
       <MarkDown markdown={text} className={textClass}></MarkDown>
       <CommandCopy txt={text} btnTxt="Copy"></CommandCopy>
       <div/>
      </div>
      </div>
      
      </div>
      )
    }

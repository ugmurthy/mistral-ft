import CommandCopy from "./CommandCopy";
import MarkDown from "./MarkDown";

export default function IconAndDisplay({content,prompt,stats,user="",evaluate=false}) {
    const tooltip = evaluate 
                  ? "Original Model"
                  :content
                        ? "FineTuned Model:"
                        : user?.name 
    const imgUrl = user.verified_email?user.picture.url:"/AI_Coach.png"
    const cls = "bg-gray-200 w-10 rounded-full"
    const avatarClass = cls + " " + (evaluate?"text-yellow-500":content
                            ? "text-orange-500"
                            :"text-blue-500 w-10")
    const text = content?content:prompt
    const textClass = content?"font text-sm":"font-semibold text-sm"
    const iconTxt = evaluate?"Or":content?"Ft":"At"
    const _stats=content?{"tokens":stats}:{"tokens":{prompt:stats.prompt}}
    
    return (
        <div>
        <div className="relative flex items-start p-2  rounded-md "> 
        <div className="mr-3">
          <div className="avatar  placeholder tooltip tooltip-right" data-tip={tooltip}>
            <div className={avatarClass}>
               
                <img src={imgUrl} alt={user?.name} />
               
            </div>
          </div>
      </div>
  
      <div
          className="p-2 flex-grow  focus:outline-none  border border-1  rounded-md"
        >
       <MarkDown markdown={text} className={textClass}></MarkDown>
       <CommandCopy txt={text} btnTxt="Copy">{JSON.stringify(_stats)}</CommandCopy>
       <div/>
      </div>
      </div>
      
      </div>
      )
    }

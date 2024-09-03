import CommandCopy from "./CommandCopy";
import MarkDown from "./MarkDown";
import ThumbsUp from "./ThumbsUpOld";
import ThumbsDown from "./ThumbsDown";
import Again from "./Again";

export default function IconAndDisplay({content,prompt,stats,qaId="",user="",evaluate=false}) {

  function thumbsUp() {
    // call updateQA
    updateQA(true,qaId);
  }
  function thumbsDn() {
    // call updateQA
    updateQA(false,qaId);
  }
  function updateQA(updn:boolean,qasId) {
    // call updateQA
    const formData = new FormData();
    formData.append("thumbsup",updn?"1":"0");
    formData.append("qasId",qasId);
    console.log("FormData ",formData.get("thumbsup"),formData.get("qasId")) ;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData
    }
    
    fetch("/api/v2/updateQA",options)
    .then((res) => res.json())
    .then((data) => {console.log(data)})
    .catch((e)=>{console.log("Error Fetching :",e)});
  }
  
    const tooltip = evaluate 
                  ? "Original Model"
                  :content
                        ? "FineTuned Model:"
                        : user?.name 
    const imgUrl = user.verified_email?user.picture.url:content
                                                          ?"/AI_Coach.png"
                                                          :"/Runner.jpeg"
    const cls = "bg-gray-200 w-10 rounded-full"
    const avatarClass = cls + " " + (evaluate?"text-yellow-500":content
                            ? "text-orange-500"
                            :"text-blue-500 w-10")
    const text = content?content:prompt
    const textClass = content?"font text-sm":"font-semibold text-sm"
    
    const _stats=content?{"tokens":stats}:{"tokens":{prompt:stats.prompt}}
    const userCls = user?" px-20":""
    const _boxCls = " p-2 flex-grow  focus:outline-none  border border-1 rounded-md"
    const boxCls =  user?"bg-base-200 "+_boxCls:_boxCls;
    console.log("IconAndDisplay ",boxCls);

    return (
        <div className={userCls}>
        <div className={"relative flex items-start p-2  rounded-md "}> 
        <div className="mr-3">
          <div className="avatar  placeholder tooltip tooltip-right" data-tip={tooltip}>
            <div className={avatarClass}>
               
                <img src={imgUrl} alt={user?.name} />
               
            </div>
          </div>
      </div>
  
      <div
          className={boxCls}
        >
       <MarkDown markdown={text} className={textClass}></MarkDown>
       <div className="flex flex-row-reverse">
       <CommandCopy txt={text} btnTxt="">{JSON.stringify(_stats)}</CommandCopy>
       {qaId && <ThumbsUp qasId={qaId}/>}
       {qaId && <ThumbsDown qasId={qaId} />} 
       {qaId && <Again aiRole={'Coach'} prompt={prompt} />} 
   
       
       </div>
       <div/>
      </div>
      </div>
      
      </div>
      )
    }

    //<div className=" opacity-60 text-xs font-thin text-left">{JSON.stringify(_stats)}</div>
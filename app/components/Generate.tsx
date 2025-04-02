/*
Sample component on how to use the useOpenRouterGenerate hook
- given a prompt and model it will respond with
- the content of the response
- the usage of the response
- the id of response to get more info on inference - such as tokens, latency, model name
*/
import { useState } from 'react'
import { useOpenRouterGenerate } from "~/hooks/useOpenRouterGenerate" 
//import MarkdownItRenderer from "./MarkDown";
import MarkdownItRenderer from "./MarkDownIt";
import CommandCopy from "./CommandCopy";
import DownLoadmd from "./DownLoadmd"
import Stats from "./Stats"
export default function Generate({prompt,model,task,showStats=false}) {
    const openModal = () => {setIsModalOpen(true);}
    const closeModal = () => {setIsModalOpen(false);}
    const [isModalOpen, setIsModalOpen] = useState(false);
    if (!model || !prompt) return <div></div>

    const [content,idArray,usage,error] = useOpenRouterGenerate(
        prompt,
        model,
        task,
        true
    )

    if (error) return <pre>Error: {JSON.stringify(error,null,2)}</pre>
    //const idArray = Array.from(idSet);
    if (!content) return <div>Loading...</div>
    const promptStr = prompt.length>100?prompt.slice(0,100)+'...':prompt;
    const stats = {id:idArray,usage:usage,model:model,prompt:promptStr}
    const statsStr = JSON.stringify(stats,null,2);
    
    let downloadFooter = idArray.join(",")
    downloadFooter += "\n"+JSON.stringify(usage);
    downloadFooter += "\n"+model;
    
    const forDownLoad = "#### "+task+"\n***\n"+prompt+"\n***\n"+content+"\n***\n"+downloadFooter;
    return (
        <div>
            {showStats&&<pre className="font-thin text-xs">{JSON.stringify(stats,null,2)}</pre>}
            <div className="p-4 text-sm font-thin">
                   <MarkdownItRenderer 
                                    markdown={content} 
                                    className="max-w-2xl mx-auto" // Additional Tailwind classes
                                    fontSize="text-lg"
                                    fontFamily="font-serif"
                                    textColor="text-blue-900"/>
                {/*<MarkdownItRenderer markdown={content} className={""}></MarkdownItRenderer>*/}
                <div className="text-black items-center  flex space-x-2">
                <CommandCopy txt={content} btnTxt="Copy"></CommandCopy>
                <DownLoadmd txt={forDownLoad}></DownLoadmd>
                <Stats stats={statsStr} onClick={openModal}></Stats>
                </div>
            </div>
            {isModalOpen && (
                    <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">{task}</h3>
                        <pre className="py-2 font-thin text-primary text-xs overflow-hidden">{statsStr}</pre>
                        <div className="modal-action">
                        <button className="btn btn-xs" onClick={closeModal}>
                            Close
                        </button>
                        </div>
                    </div>
                    </div>
                )}
        </div>
        )

} 
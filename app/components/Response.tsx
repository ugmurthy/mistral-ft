/*
Sample component on how to use the useOllama hook
- given a prompt and model it will respond with
- the text composed of streamed responses

*/
import { useState } from 'react'
import { useOllama, chatStream2Content } from "~/hooks/useOllama" 
import MarkdownItRenderer from "./MarkDownIt";
import CommandCopy from "./CommandCopy";
import DownLoadmd from "./DownLoadmd"

export default function Generate({prompt,model,task="",debug=false}) {
    const openModal = () => {setIsModalOpen(true);}
    const closeModal = () => {setIsModalOpen(false);}
    const [isModalOpen, setIsModalOpen] = useState(false);
    if (!model || !prompt) return <div></div>

    const [data,error] = useOllama( prompt,model,task,debug)

    if (error) return <pre>Error: {JSON.stringify(error,null,2)}</pre>

    if (!data) return <div>Loading...</div>
    let downloadFooter = model;
    
    const retval = chatStream2Content(data)
    const content = retval.content
    const stats = retval.stats

    const forDownLoad = "#### "+task+"\n***\n"+prompt+"\n***\n"+content+"\n***\n"+downloadFooter+"\n***\n"+stats;
   
    return (    
            <div className="p-4 text-sm font-thin">
                <MarkdownItRenderer 
                                    markdown={content} 
                                    className="max-w-6xl mx-auto" // Additional Tailwind classes
                                    fontSize="text-lg"
                                    fontFamily="font-serif"
                                    textColor="text-blue-900"/>
                <div className="text-black items-center  flex space-x-2">
                    <CommandCopy txt={content} btnTxt="Copy"></CommandCopy>
                    <DownLoadmd txt={forDownLoad}></DownLoadmd>
                </div>
            </div>
        )

} 
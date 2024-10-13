
import { useState } from 'react';
export default function Prompt() {

    const [streamData,setStreamData] = useState("");
    const template = {prompt:"text",model:"text"};
    const [formValues, setFormValues] = useState({});
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
  };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("handleSubmit :",formValues)
        const formData = new FormData();
        formData.append("model",formValues.model);
        formData.append("prompt",formValues.prompt);

        try {
            const response = await fetch("/api/v2/openrouter/generate", {
                method: "POST",
                body: formData,
                headers: {
                    'Content-Type': 'text/event-stream'
                  }
            })
            console.log("handleSubmit :placed POST Request");

            if (response.ok) {
                const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    console.log("handleSubmit : Received ",value);
                    setStreamData(prevData => prevData + value);
                }
            } else {
                console.error("Error:", response.statusText);
            }
    
        }
        catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
           <form method="POST" className="p-10 space-y-2 flex flex-col items-center" action="/api/v2/openrouter/generate">
            <input
                    name="prompt"
                    type="text"
                    onChange={handleInputChange}
                    placeholder="Ask me anything"
                    className="input input-bordered input-primary w-full max-w-xs" />
            <input
                    name="model"
                    type="text"
                    onChange={handleInputChange}
                    placeholder="model"
                    className="input input-bordered input-primary w-full max-w-xs" />
            <button type="submit" className="btn btn-sm">Submit</button>
            </form>

            <div className="p-10 text-sm font-thin">
                {streamData}
            </div>
        </div>
    )

} 
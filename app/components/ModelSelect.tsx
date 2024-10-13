import React, { useState } from 'react';

function OpenRouterModelsItem({ model }) {
    const modelstring = getModelString(model);
    return (
        <li >
            <div className="divider divider-primary divider-start "></div>
            <details className="collapse ">
                    <summary className="collapse-title text-sm font-thin">
                        <pre>{model.id}</pre>
                        <div>{modelstring}</div>
                    </summary>
                    <div  className="collapse-content text-xs font-thin italics text-blue-600">
                    <p className="text-red-700">modality: {model.architecture?.modality}</p>
                    <p>{model.description}</p>
                    
                    </div>
            </details>
        </li>  
    );
}

// get price per million tokens for prompt,completions and image if avaialble
function getPricePerMillionTokens(pricing) {
    let {prompt,completion,image} = pricing;
    prompt = parseFloat(prompt);
    completion = parseFloat(completion);
    image = parseFloat(image);
    // mult by 1000000 to get price per million tokens
    prompt = prompt * 1000000;
    completion = completion * 1000000;
    image = image * 1000;
    return {prompt,completion,image};
}

// get model string comprising on name,id,context length and price
// useful for search
function getModelString(model) {
    const {prompt,completion,image} = getPricePerMillionTokens(model.pricing);
    let free=false
    if (prompt+completion+image === 0) {
        free = true;
    }
    let price = free ? "Free" : `$${prompt.toFixed(2)}/M input tokens, $${completion.toFixed(2)}/M output tokens` ;
     price = price + (image===0 ? "" : `, $${image.toFixed(2)}/K input images`)
    return `${model.name} | ${model.context_length} context | ${price}`;
}



export default function ModelSelector({ allmodels }) {

    const[filterText,setFilterText] = useState(''); 
    const[filteredModels,setFilteredModels] = useState(allmodels);
    
    function handleChange(e) {
        setFilterText(e.target.value);
        const filteredModels = allmodels?.filter(m =>
            getModelString(m).toLowerCase().includes(filterText?.toLowerCase()))
            //console.log(filterText);
            //console.log(filteredModels);
        setFilteredModels(filteredModels);
    }

return (
    <div>
        <div className='p-2 flex space-x-2'>
        <input className='input input-bordered input-primary w-full max-w-xs'
            type="text"
            placeholder="Search for a Model..."
            value={filterText}
            onChange={handleChange}
        />
        <select className='select select-primary w-full max-w-xs'>
            <option value="">Select a Model</option>
            {filteredModels.map(m => {
                return <option key={m.id} value={m.id}>{m.id}</option>;
            })}
        </select>
        </div>
            <ul>
               {filteredModels.map((model) => (
                <OpenRouterModelsItem key={model.id} model={model} />))}
           </ul>
    </div>
    )
};
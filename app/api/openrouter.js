

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/"
const HEADERS = {
    "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://rungenie.vercel.app",
    "X-Title": "RuGenie",
}
// DEFAULT FEATURES
const TEMPERATURE  = 0.7;
const MAX_TOKENS = 2048;
const STREAM = true;
const MODEL = "google/gemini-flash-1.5-8b-exp";

const controller = new AbortController();
const signal = controller.signal;
// get all models - returns an array of objects
// 
/* each object contains follwing properties
[
  'id',
  'name',
  'created',
  'description',
  'context_length',
  'architecture' :{modality, tokenizer, instruct_type},
  'pricing': {prompt, completion, image, request},
  'top_provider' :{context_length, max_completion_tokens, is_moderated}
  'per_request_limits'
]
*/
export async function get_models() {
    const response =  await fetch(OPENROUTER_BASE_URL+"models")
    const models = await response.json()
    return models.data;
}

// get supported params for a model
export async function get_supported_params(model) {
    const response = await fetch(OPENROUTER_BASE_URL+"parameters/"+model,{headers:HEADERS})
    return await response.json();
}

export  function stop_generation() {
    controller.abort();
}

// model exists?
export async function model_exists(model) {
    const ret_val = await get_supported_params(model);
    if (Object.keys(ret_val).includes("error")) {
        return false;
    } else {
        return true;
    }        
}

// chat with a model
export async function open_router_generate(features,messages,stream=STREAM) {
    // features is a object containing model parameters and model
    // messages is 
    const {temperature,model,max_tokens} = features;

    if(!messages && Array.isArray(messages)) {
        throw new Error("Messages[] is required");
    }

    const options = {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({
            "model": model?model:MODEL,
            "messages": messages,
            "temperature": temperature?temperature:TEMPERATURE,
            "max_tokens": max_tokens?max_tokens:MAX_TOKENS,
            "stream":stream,
        }),
        signal:signal, 
    }
    const response = await fetch(OPENROUTER_BASE_URL+"chat/completions", options);
    // return new Response(response.body, {
    //     headers:{'Content-type':'text/event-stream'}
    //   });
    return response;
}



/// helpers
// get price per million tokens for prompt,completions and image if avaialble
export function getPricePerMillionTokens(pricing) {
    let {prompt,completion,image} = pricing;
    prompt = parseFloat(prompt);
    completion = parseFloat(completion);
    image = parseFloat(image);
    // mult by 1000000 to get price per million tokens
    prompt = prompt * 1000000;
    completion = completion * 1000000;
    image = image * 1000000;
    return {prompt,completion,image};
}
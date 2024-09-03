
import _ from 'lodash';

const MISTAL_BASE_URL = 'https://api.mistral.ai/v1/'

const models = [
  {"role":"Coach","model":"ft:open-mistral-7b:504267b8:20240620:MyCoach:29b5b062"},
  {"role":"Coach2","model":"ft:open-mistral-7b:504267b8:20240627:CSFTcoach:aa7f65ec"},
  {"role":"Coach1","model":"ft:open-mistral-7b:504267b8:20240628:FTCoach2806:4d403348"}, // very chatty
  {"role":"Original","model":"open-mistral-7b"},
  {"role":"Evaluate","model":"mistral-large-latest"}
]
// old: "ft:open-mistral-7b:504267b8:20240620:MyCoach:29b5b062"  // This is concise
// new: "ft:open-mistral-7b:504267b8:20240627:CSFTcoach:aa7f65ec" // This is slightly more verbose : So far the best
// new: "ft:open-mistral-7b:504267b8:20240628:FTCoach2806:4d403348" // THIS IS TOO VERBOSE needs > 1000+ tokens, this has system prompt



const DEFAULT_TOPICS=[
  'Exercise and Fitness',
  'Nutrition and Diet',
  'Mental Health and Well-being',
  'Lifestyle and Habits',
  'Distance Running',
  'Strength Training',
  'Yoga and Flexibility',
  'Weight Loss and Management',
  'Injury Prevention and Recovery',
  'Performance Enhancement',
  'Motivation and Goal Setting',
  'Race strategy',
  'Running Technique',
  'Nutritional Supplements',
]
export async function mistralEvalQ(model,prompt,topics_ary=[],stream=false) {
        const temperature = 0.2;
        const topics = topics_ary.length>0?topics_ary:DEFAULT_TOPICS;
        const response_format = { "type": "json_object" };
        const evaluationPrompt = `
        Evaluate the following prompt based on the given topics and generate a follow-up prompt.
    
        Prompt: "${prompt}"
    
        Topics: ${topics.join(', ')}
    
        1. Specificity: Score from 1 to 10, how specific the prompt is.
        2. Relevance: Score from 1 to 10, how relevant the prompt is to the topics.
        3. Complexity: Score from 1 to 10, how complex the prompt is in terms of understanding and interpretation.
        4. Open: Score from 1 to 10, how open-ended the prompt is.
        5. Follow-up prompt: A follow-up prompt that builds on the original prompt, focusing on a specific aspect or area that was not fully explored in the original prompt.
        
        Provide the result as a JSON object with keys 'specificity', 'relevance', 'open', 'complexity' and 'follow_up_prompt'.
        
        `;
        const system = "you are an evaluation assistant"
        const messages = [{role:"system",content:system},{role: "user", content: evaluationPrompt}]
        const url = MISTAL_BASE_URL + 'chat/completions'
        const apiKey = process.env.MISTRAL_API_KEY
        const body = JSON.stringify({model,messages,stream, temperature,response_format});

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
        const options = {
            headers,
            method:"POST",
            body
        }
        //console.log("URL ",url)
        const response = await fetch(url,options) 
        //console.log("response ",response) 
        return response
      }

export async function mistralChat(role,messages,features=null,stream=true) {
        let model;
        try {
           model = _.find(models,function(m) {return m.role===role}).model;
        } catch(e) {
          model=""
        }

        if (!model) {
          throw new Error("Invalid or missing 'role' ")
        }
        const temperature = features?.temperature || 0.8; // keep it more focussed and deterministic
        const safe_prompt = true;
        const random_seed = 42; // keep it more deterministic
        const max_tokens = features?.max_tokens || 2000;
        const url = MISTAL_BASE_URL + 'chat/completions'
        const apiKey = process.env.MISTRAL_API_KEY
        const body = JSON.stringify({model,messages,stream, temperature,safe_prompt,random_seed, max_tokens});
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
        const options = {
            headers,
            method:"POST",
            body
        }
        //console.log("URL ",url)
        const response = await fetch(url,options) 
        //console.log("response ",response) 
        return response
}

export function modelDesc(role) {
  const model = _.find(models,function(m) {return m.role===role}).model;
  const details = model.split(":");
  if (details.length<6) {
    return {original:details[0]}
  } else {
    return     {fineTunedModel:details[4],original:details[1]}
  }
}

// smart evaluator for prompt
export async function promptEvaluator(prompt) {

  const ret_val = await mistralEvalQ("open-mistral-7b",prompt);
  const ret_val_json = await ret_val.json();
  
  const eval_result = JSON.parse(ret_val_json?.choices[0].message.content)
  const followUp =  ((10-eval_result.open + eval_result.complexity) / 2)<5?true:false
  const relevant = eval_result.relevance>7?true:false;
  const score = {relevance:eval_result.relevance,specificity:eval_result.specificity,open:eval_result.open,complexity:eval_result.complexity}
  if (followUp && relevant) { // only if it is more open ended, less complex and relevant
    return {followUp:eval_result.follow_up_prompt,score}
  } else {
    return {followUp:null,score}
  }
}
//helpers
export function dumpMessage(messages) {
  // formatted output of messages array
  if (!Array.isArray(messages)) {
    console.log("mistralAPI.server : Invalid 'messages' array")
     return
  }
  console.log(`---------- messages array of len(${messages.length}) ---------`)
  messages.forEach(function(m,i) {
    let content = m.content.length>40?m.content.substring(0,40):m.content;
    content = content.split("\n").join(" ");
    content.replaceAll("\r","");
    let clen = m.content.length;
    console.log(i,"Role:",m.role, "\n  Content:",`${content} - (${clen})chars`)
  })
  console.log("---------- end messages array dump ---------")
} 

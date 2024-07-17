
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
export async function mistralChat(role,messages,stream=true) {
        let model;
        try {
           model = _.find(models,function(m) {return m.role===role}).model;
        } catch(e) {
          model=""
        }

        if (!model) {
          throw new Error("Invalid or missing 'role' ")
        }
        const temperature = 0.6; // keep it more focussed and deterministic
        const safe_prompt = true;
        const random_seed = 1337; // keep it more deterministic
        const max_tokens = 3000;
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
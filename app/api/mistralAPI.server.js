
import _ from 'lodash';

const MISTAL_BASE_URL = 'https://api.mistral.ai/v1/'

const models = [
  {"role":"Coach","model":"ft:open-mistral-7b:504267b8:20240620:MyCoach:29b5b062"},
  {"role":"Original","model":"open-mistral-7b"},
  {"role":"Evaluate","model":"mistral-large-latest"}
]

export async function mistralChat(role,messages,stream=true) {
        const model = _.find(models,function(m) {return m.role===role}).model;
      
        const url = MISTAL_BASE_URL + 'chat/completions'
        const apiKey = process.env.MISTRAL_API_KEY
        const body = JSON.stringify({model,messages,stream});
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


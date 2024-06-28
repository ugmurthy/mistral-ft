import _ from 'lodash'

export function chunks2JSON(chunks) {
    // arg0 : text chunk as received from data stream
    // returns array of json which could be empty
    // process chunks - could be multiline json text - the newlines could be anywhere
    //
    let lines = chunks.split("\n\n") 
    lines = _.compact(lines); 
    lines = _.flatten(lines);
    // now we are good to convert array of jsontext to json
    const linesJSON=[]

    for (const line of lines ) {
        try { // try parsing
            const start = _.indexOf(line,"{");
            const end = _.lastIndexOf(line,"}");
            const ljson = JSON.parse(line.substring(start,end+1))
            linesJSON.push(ljson);
        } catch(e) {
            console.log('Error:chunk2JSON: parsing chunk',line);
            
        }  
     }    
    
    return linesJSON
}

// for open ai APi data stream
export function jsonArray2Content(allJSON) {
    let content=''
    for (const j of allJSON) { content += j.choices[0].delta.content}
    return content;
}

export function getStats(lastJSON){
    // input last JSON from server
    // openai api format
    const p = lastJSON?.usage.prompt_tokens
    const t = lastJSON?.usage.total_tokens
    const c = lastJSON?.usage.completion_tokens;
    return {prompt:p, response: c,total: t}
}
// for delays
export function sleep(time) {
    // time in millisecs
    new Promise((resolve) => setTimeout(resolve,time));
}




/* TESTING chunks2JSON
allJSON=[]
for (let i=0;i<chunks.length;i++) {
    let lj = chunks2JSON(chunks[i]); // return an array of one or more text lines
    //console.log("chunks2JSON returned lj of length ",lj.length, `at chunk # ${i}`);
    allJSON = [...allJSON, ...lj] 
}
console.log("total chunks ",chunks.length);
console.log("total jsons ",allJSON.length)
var content=''
for (j of allJSON) { content += j.choices[0].delta.content}
console.log("Content ",content) */
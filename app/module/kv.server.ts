const KV_EXPIRY_SECONDS = process.env.KV_EXPIRY_SECONDS
            ? process.env.KV_EXPIRY_SECONDS 
            :  300 //for now five minutes //60 * 60 * 24 //one day
       
const url = process.env.KV_REST_API_URL
const token = process.env.KV_REST_API_TOKEN
export const KV_EXPIRY_STRAVA = process.env.KV_EXPIRY_STRAVA
           ? parseInt(process.env.KV_EXPIRY_STRAVA ):
           60 * 60 * 24 * 30 //one month

export async function setKV(key: string, value:string, expiry: Number) {
    const setURL = url+"/pipeline"
    if (!expiry) expiry = KV_EXPIRY_SECONDS;
    const body = [["SET",key,value,"EX",expiry],["GET",key]]
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body)
    }
    //console.log("setKV url", setURL,"\n", options)
    const response = await fetch(setURL, options)
    const result = await response.json()
    const status = result[0].result
    //console.log("setKV result", result)
    try{
        if (status != "OK" || result.length>2) {
            throw new Error("setKV failed: "+status, result[1].result)
        }
        return JSON.parse(result[1].result);
    } catch(e) {
        console.error("setKV failed ",e)
        return null
    } 
}

export async function getKV(key: string) {
    
    const getURL = url+"/get/"+key
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    }
    //console.log("getKV url", getURL)
    const response = await fetch(getURL, options)
    const result = await response.json()
    
    // check what happens if result.result is null.
    // return null if key not found;
    return JSON.parse(result.result)
}
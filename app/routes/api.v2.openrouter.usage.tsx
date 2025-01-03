
import {  getSearchParamsAsJson } from "~/helpers/webUtils.server";
import {  getGenerationStats } from "~/api/openrouter";

export const loader = async ({request}) => {
    const {id} =  getSearchParamsAsJson(request);
    if (!id) { return { error: "id missing"}; }
    console.log(id);
    const stats = await getGenerationStats(id);
    console.log(stats); 
    return stats;
}



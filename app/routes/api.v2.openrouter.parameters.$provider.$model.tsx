//
// Get all model details on openrouter
//

import { get_supported_params } from "~/api/openrouter";
import { useLoaderData } from "@remix-run/react";
export async function loader({params}) {
    const model = params.model;
    const provider = params.provider;
    console.log("/api/v2/openrouter/parameters/model: ",provider,model)
    const ret_val = await get_supported_params(provider+"/"+model);
    return ret_val;
}




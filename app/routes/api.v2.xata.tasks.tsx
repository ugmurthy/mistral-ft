//
// Get all tasks from xata
//

import { useLoaderData } from "@remix-run/react";
import db from "../module/xata.server";

export async function loader() {
    const taskList = await db.getTasks();
    console.log("/api/v2/xata/tasks ",taskList?.length)
    return taskList.map((t)=>{return {'id':t.id,'task':t.task,'model':t.model}});
}


export default function OpenRouterModels() {
    const taskList = useLoaderData();
    return (
        <div>
           <h1>Tasks</h1>
           <pre className="text-xs font-thin font-mono">{JSON.stringify(taskList,null,2)}</pre>
        </div>
    )
}
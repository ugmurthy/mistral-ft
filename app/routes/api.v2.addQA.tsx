// insert record to xata.io table qas
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import db from '../module/xata.server'
import {z} from 'zod';
import {zx} from 'zodix';
import {setKV, getKV} from "../module/kv.server"
import { getFeaturesSession, requireUserId } from '../module/session/session.server';
import { dumpMessage} from "~/api/mistralAPI.server";

//@TODO later remove option once we implement conversations - see conversationId
const schema = z.object({
    question: z.string(),
    answer: z.string(),
    stats: z.string(),
    userId: z.string(),
    cId: z.string()
});

export async function action(args: ActionFunctionArgs) {
    const userId = await requireUserId(args.request);
    const result = await zx.parseFormSafe(args.request, schema);

    //console.log("/api/v2/addQA: result ",result.data)
    //console.log("/api/v2/addQA: userId ",userId)
    if (!userId) {
        throw redirect("/login");
    }
    const {features} = await getFeaturesSession(args.request);
    //console.log("/api/v2/addQA: features ",features)
    // write records to xata.io table qas
    let write_qas = 0;
    try {
        write_qas = parseInt(features.write_qas)
        console.log("/api/v2/addQA: write_qa from features ",write_qas)
    } catch (e) {
        write_qas = 0;
        console.log("/api/v2/addQA: error getting write_qa from features setting it to 0");
    }
    if(write_qas!==1) {
        console.log("/api/v2/addQA: Not logging QAs")
    } else {
        console.log("/api/v2/addQA: Logging QAs")
    }

    
    if (result.success) {
        // write QA to xata.io table qas only if WRITE_QAS is set
        const record = (write_qas!==1)?null:await db.addQA(result.data);
        let memory = await getKV(result.data.cId)
        // deal with null memory
        if (memory === null) {
            console.log("/api/v3/addQA: get_memory is null")
            memory = []
        }
        // add an array of current_message and get_memory to the KV store
        const current_message = [{role:"user",content:result.data.question},{role:"assistant",content:result.data.answer}]
        // check if current question is same as last question in memory
        
        // check if memory has a question and answer pair, if so, check if the question is the same as the current question
        if (memory.length > 1 && memory[memory.length-2].content === result.data.question) {
            // same question so don't add to memory
            console.log("/api/v2/addQA: SAME question")
        } else {
            // different question  so add to memory
            const message_array = [...memory,...current_message]
            const ret_val = await setKV(result.data.cId, JSON.stringify(message_array));
            console.log("/api/v2/addQA: DIFFERENT question")
            console.log("/api/v2/addQA: message_array, memory len = ",memory.length);
            //dumpMessage(message_array);
        }
        
        
        //console.log("/api/v2/addQA: setKV returns (memory) ",ret_val)
        return record
    } else {
     console.log("/api/v2/addQA: Error Parsing FormData: ",result.error);
     return null
    }
     
}
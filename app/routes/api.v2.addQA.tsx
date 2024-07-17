// insert record to xata.io table qas
import { ActionFunctionArgs } from '@remix-run/node';
import db from '../module/xata.server'
import {z} from 'zod';
import {zx} from 'zodix';

const schema = z.object({
    question: z.string(),
    answer: z.string(),
    stats: z.string(),
    userId: z.string(),
});

export async function action(args: ActionFunctionArgs) {

    // write records to xata.io table qas
    if(!process.env.WRITE_QAS) {
        console.log("Not logging QAs")
        return null;
    }

    const result = await zx.parseFormSafe(args.request, schema);
    if (result.success) {
     console.log("/api/v2/addQA : ",result.data.userId);
     const record = await db.addQA(result.data);
     return record
    }
     
     return null
     
}
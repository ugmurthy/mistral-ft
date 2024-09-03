// insert record to xata.io table qas
import { ActionFunctionArgs, json } from '@remix-run/node';
import db from '../module/xata.server'
import {z} from 'zod';
import {zx} from 'zodix';

// const schema = z.object({
//     thumbsup:z.string().max(1),
//     qasId: z.string(),
// });

const schema = z.object({
    qasId: z.string(),
    thumbsup: z.string(),
});

export async function action(args: ActionFunctionArgs) {
    // update record to xata.io table qas
    /*
    Usage:
    curl -X POST -H "Content-Type: application/json" -d '{"thumbsup":true,"qasId":"rec_01GX8X50000000000000000000000000"}' http://localhost:3000/api/v2/updateQA
    args = {"thumbsup":boolean,"qasId":"rec_9900999saf888"}
    */
    const result = await zx.parseFormSafe(args.request, schema);
    

    if (result.success) {
     console.log("/api/v2/updateQA : ",JSON.stringify(result.data,null,2));
     const thumbsup = result.data.thumbsup==='1'?true:false;
     const qasId = result.data.qasId;
     const record = await db.updateQA({qasId,thumbsup});
     return record
    }
    console.log("/api/v2/updateQA : ",JSON.stringify(result.error,null,2));
    return json(result.error, { status: 400 });
     
}
/* 
export async function loader() {
    return json({ message: 'updateQA Loader' });
}



function component() {
  return (
    <div className='p-20'>
    <div>api.v2.updateQA</div>
    <form >
        <input type="text" name="thumbsup" placeholder="thumbsup" />
        <input type="text" name="qasId" placeholder="qasId" />
        <button type="submit">Submit</button>
    </form>
    </div>
  )
}

export default component */
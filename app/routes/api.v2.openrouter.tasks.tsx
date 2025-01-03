import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import {useState} from 'react';
import db from "../app/module/xata.server";
import Generate from "~/components/Generate";
import Modal from "~/components/Modal";

import { getFormData, getSearchParamsAsJson } from "~/helpers/webUtils.server";
import { prev } from "node_modules/cheerio/dist/esm/api/traversing";
//import { get } from "lodash";
export const loader = async ({request}) => {
    const {prompt} =  getSearchParamsAsJson(request);
    const country = request.headers.get('x-vercel-ip-country') || 'UNKNOWN';

    console.log("country  ",country)
    let tasks = await db.getTasks();
    //    tasks = tasks.map((t)=>{return {'id':t.id,'task':t.task,'task_description':t.task_description,'model':t.model}});
    // for now we are just returning the tasks without description
    tasks = tasks.map((t)=>{return {'id':t.id,'task':t.task,'model':t.model}});
    //tasks.push({'prompt':prompt});
    return {tasks,prompt};
}


function Task({id,task,model,prompt}) {

    const [isEnabled, setIsEnabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleSwitch = () => setIsEnabled(!isEnabled);
    //const openModal = (modalName) => setModals(prevState => ({ ...prevState, [modalName]: true }));
    //const closeModal = (modalName) => setModals(prevState => ({ ...prevState, [modalName]: false }));
    const openModal = () => {setIsModalOpen(true);}
    const closeModal = () => {setIsModalOpen(false);}

    

    return (
    <div className="border p-4 rounded-lg shadow-md">
      <div className="flex items-center">
        <label className="cursor-pointer label">
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-xs"
            checked={isEnabled}
            onChange={toggleSwitch}
          />
        </label>
        <div onClick={openModal} className={isEnabled?"":" font-thin"}>{task}</div>
       
      </div>
      {isEnabled&&(<div>
        <Generate prompt={prompt} task={task} model={model} />
      </div>)}
   {/*     <Modal isOpen={modals['modal_task']} closeModal={closeModal('modal_task')} heading={task} body={id} prebody={model}/>
         <Modal isOpen={setModals['modal_stats']} closeModal={closeModal('modal_stats')} heading={task} body={"Usage Statistics"} prebody={stats}/>
 */}
    {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{task}</h3>
            <p className="py-4">{id}</p>
            <p className="py-4">{model}</p>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
/*
{isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{task}</h3>
            <p className="py-4">{id}</p>
            <p className="py-4">{model}</p>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
*/
export default function Tasks() {
    const {tasks,prompt} = useLoaderData();
    //const prompt = "https://arxiv.org/pdf/2411.04925"

    console.log("prompt ",prompt);
     return (
        <div>
            <form>
                <input placeholder="URL of ...."type="text" name="prompt" defaultValue={prompt} className="p-4 className=input input-bordered input-primary w-full max-w-xs"/>
            </form>


            
            <pre className="text-xs font-thin">{prompt}</pre>
            {prompt&&<h1>Select relevant tasks</h1>}
            {prompt&&<ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                       <Task id={task.id} task={task.task} model={task.model} prompt={prompt} />
                    </li>
                ))}
            </ul>}
        </div>
     );
}
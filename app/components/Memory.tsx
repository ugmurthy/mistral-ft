import IconAndDisplay from "./IconAndDisplay";

function Memory({memory,qaId,stats,user}) {

        if (!Array.isArray(memory)) {
            return <div>No memory data available.</div>;
        }
       
        const ret_jsx = [];
        for (let i=0;i<memory.length;i=i+2){
            if (memory[i].role==="user"){
                ret_jsx.push(<IconAndDisplay prompt={memory[i].content} content="" stats={stats} user={user} />)
            }
            if (memory[i+1].role==="assistant"){
                ret_jsx.push(<IconAndDisplay content={memory[i+1].content} prompt={memory[i].content} stats={stats} qaId={qaId}/>)
            }
        }
        return (
            <div>
                {ret_jsx}
            </div>
        )
      /*
      <IconAndDisplay prompt={prompt} content="" stats={stats} user={user} />
      <IconAndDisplay content={content} prompt={prompt} stats={stats} qaId={qaId}/>
      */
  return (
    <div>
       {memory.map((message, index) => {
            
                return (
                        <div key={index}>
                            {message.role==="user"
                            ?<IconAndDisplay prompt={message.content} content="" stats={stats} user={user} />
                            :<IconAndDisplay content={message.content} prompt="" stats={stats} qaId={qaId}/>}
                        </div>
                    )
                    }
        )}
    </div>
  )
}

export default Memory
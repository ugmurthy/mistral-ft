import _ from 'lodash';

const db = {}

db.addUser = async (user) => {
    // add user to database (INSERT INTO users (email, name, password))
    /* returns {
         "id": "rec_cq8gubfhqm2k22v7g3u0",
        "xata": {
            "createdAt": "2024-07-12T11:10:37.847892Z",
            "updatedAt": "2024-07-12T11:10:37.847892Z",
            "version": 0
        }
    }
  */
    const body = JSON.stringify(user);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.XATA_API_KEY}`
          },
            body: body  // body data type must match "Content-Type" header
        }
    const URL= process.env.XATA_URL+"/tables/users/data?columns=id"
    const response = await fetch(URL, options);
    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        console.log("Error inserting record to user table")
        return null
    }
}

db.findUserById = async (id) => {
    // find user by id (SELECT * FROM users WHERE id = id)
    // return user
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.XATA_API_KEY}`
          }
        }
    const URL= process.env.XATA_URL+"/tables/users/data/"+id
    const response = await fetch(URL, options);
    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        console.log("Error finding record to user table")
        return null
    }
}
/// get user by email
/*
const options = {
  method: 'POST',
  headers: {Authorization: 'Bearer <XATA_API_KEY>', 'Content-Type': 'application/json'},
  body: '{"columns":["email","name","password"],"filter":{"email":"kartik@sample.com"},"page":{"size":15}}'
};

fetch('https://u-g-murthy-s-workspace-8a25u9.ap-southeast-2.xata.sh/db/run-assist:main/tables/users/query', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
*/
db.findUserByEmail = async (email) => {
    // find user by email (SELECT * FROM users WHERE email = email)
    // return user
    const body = JSON.stringify({
        "columns":["email","name","password"],
        "filter":{"email":email}
    });
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.XATA_API_KEY}`
          },
            body: body  // body data type must match "Content-Type" header
        }
    const URL= process.env.XATA_URL+"/tables/users/query"
    const response = await fetch(URL, options);
    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        console.log("Error finding UserByEmail ",email)
        return null
    }
}

db.addAuthtoken = async ({selector,hashedValidator,userId}) =>{
    // add authtoken to database (INSERT INTO authtokens (selector, hashedValidator, userId))
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.XATA_API_KEY}`
          },    
            body: JSON.stringify({selector,hashedValidator,userId})  // body data type must match "Content-Type" header
    }
    const URL= process.env.XATA_URL+"/tables/authtokens/data?columns=id"
    const response = await fetch(URL, options);
    if (response.ok) {  //200
        const data = await response.json()
        return data
        /* Note return pattern below for token insert
        {
            "id": "rec_cq9484vhqm2k22v7htvg",
            "xata": {
                "createdAt": "2024-07-13T09:08:35.161127Z",
                "updatedAt": "2024-07-13T09:08:35.161127Z",
                "version": 0
            }
        }
        */
    } else {
        console.log("Error inserting record to authtokens table")
        return null
    }
}
db.authtokenDeleteMany = async (userId) => {
    //1 get all authtokens for a user (SELECT * FROM authtokens WHERE userId.id = userId)
    let body = JSON.stringify({
        "columns":["id"],
        "filter":{"userId.id":userId}
    });
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.XATA_API_KEY}`
          },
            body: body  // body data type must match "Content-Type" header
        }
    let URL= process.env.XATA_URL+"/tables/authtokens/query"
    //console.log("URL ",URL)
    //console.log("options ",options)

    let response = await fetch(URL, options);

    if (!response.ok) {
        console.log("Error finding authtokens for user ",userId)
         return null 
    }
    let data = await response.json()
    const ids = _.map(data.records, 'id');
    console.log("Tokens ids to be deleted ",ids);

    //2 delete all authtokens for a user (DELETE FROM authtokens WHERE id is in ids)
    // reusing body,options,response,data and URL variables 
    const operations = ids.map(id => ({ delete: {table:"authtokens", id }}));
    body = JSON.stringify({operations});
    options = { 
            method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${process.env.XATA_API_KEY}`
               },
                 body: body  // body data type must match "Content-Type" header
             }
         // delete the tokens from the database
    URL= process.env.XATA_URL+"/transaction"
    response = await fetch(URL, options);
    if (!response.ok) {
        console.log("Error deleting authtokens for user ",userId)
        return null
    }
    data = await response.json()
    const count = _.sum(_.map(data.result,'rows')) // sum of rows affected in each operation
    return count;
    // return number of authtokens deleted
}

db.findTokendBySelector = async (selector) => {
    // find authtoken by selector (SELECT * FROM authtokens WHERE selector = selector)
    let body = JSON.stringify({
        "columns":["*"],
        "filter":{"selector":selector}
    });
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.XATA_API_KEY}`
          },
            body: body  // body data type must match "Content-Type" header
        }
    let URL= process.env.XATA_URL+"/tables/authtokens/query"
    let response = await fetch(URL, options);
    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        console.log("Error finding authtoken by selector ",selector)
        return null
    }
}

// get all tasks from the database as an array of strings
db.getTasks = async (columns=["task","task_description","model"],size=100) => {
    let URL= process.env.XATA_URL+"/tables/tasks/query"
    let body = JSON.stringify({"columns":columns,"page":{"size":size}});
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.XATA_API_KEY}`
          },
            body: body  // body data type must match "Content-Type" header
        }
    let response = await fetch(URL, options);
    if (response.ok) {
        const data = await response.json()
        return data.records;
        //return _.map(data.records, 'task');
    } else {
        console.log("Error getting tasks")
        return null
    }
}
///QA : table name : qas
/// columns : [id,question:string,answer:string,stats:string,userId:link(users)]
db.updateQA = async (jsonThumbsUp) => {
    // updates field thumbsup in qas table (UPDATE qas SET thumbsup = true/false WHERE id = id)
    /* returns {
    "id": "rec_cqjjuhm3h9bv4g9iu210",
    "xata": {
            "createdAt": "2024-07-29T07:05:42.406066Z",
            "updatedAt": "2024-07-29T11:36:53.53872Z",
            "version": 1
            }
        }
    */
   const thumbsup = jsonThumbsUp.thumbsup;
   const id = jsonThumbsUp.qasId;
   const body = JSON.stringify({thumbsup});
   const options = {
       method: 'PATCH',
       headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${process.env.XATA_API_KEY}`
         },
           body: body  // body data type must match "Content-Type" header
       }
   const URL= process.env.XATA_URL+"/tables/qas/data/"+id
   console.log("URL: ",URL)
   console.log("Body :",body)
   const response = await fetch(URL, options);
   if (response.ok) {
       const data = await response.json()
       return data
   } else {
       console.log("Error updating thumbsup in qas table ",id)
       return await response.json();
   }
}
db.addQA = async (jsonQA) => {
    // add user to database (INSERT INTO qas (question, answer, stats))
    /* returns {
         "id": "rec_cq8gubfhqm2k22v7g3u0",
        "xata": {
            "createdAt": "2024-07-12T11:10:37.847892Z",
            "updatedAt": "2024-07-12T11:10:37.847892Z",
            "version": 0
        }
    }
  */
    const body = JSON.stringify(jsonQA);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.XATA_API_KEY}`
          },
            body: body  // body data type must match "Content-Type" header
        }
    const URL= process.env.XATA_URL+"/tables/qas/data?columns=id"
    const response = await fetch(URL, options);
    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        console.log("Error inserting record to qas table",await response.json())
        return null
    }
}

db.addConversation = async (jsonConversation) => {
    // add user to database (INSERT INTO conversation (userId))
    
    /* 
    body = {
        "userId":"rec_cqahbpi4br5n82p6r7c0"
        }
    returns {
         "id": "rec_cq8gubfhqm2k22v7g3u0",
        "xata": {
            "createdAt": "2024-07-12T11:10:37.847892Z",
            "updatedAt": "2024-07-12T11:10:37.847892Z",
            "version": 0
        }
    }
  */
    const body = JSON.stringify(jsonConversation);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.XATA_API_KEY}`
          },
            body: body  // body data type must match "Content-Type" header
        }
    const URL= process.env.XATA_URL+"/tables/conversations/data?columns=id"
    const response = await fetch(URL, options);
    if (response.ok) {
        const data = await response.json()
        return data.id
    } else {
        console.log("Error inserting record to conversation table",await response.json())
        return null
    }
}

db.imageUrlToBase64 = async (imageUrl) => {
    try {
        // Fetch image data from URL
        const response = await fetch(imageUrl);
        // Convert image data to base64 format
        const imageBlob = await response.blob();
        const abuff = await imageBlob.arrayBuffer();
        const imageBase64 = Buffer.from(abuff).toString('base64'); // convert to base64
        // Return base64 string
        return imageBase64;

    } catch (error) {
        console.error('Error converting image URL to base64:', error);
        return null;
    }
}

// give a task (string) return the description (string)
db.getTaskDescription = async (task) => { 
    // search in 'tasks' table and column 'task' for query string=task
    if (!task) {
        return null
    }
    const body = JSON.stringify(
        {query: task,
            tables:[
            //  {table:"users",target:[]}, 
            //  {table:"authtokens",target:[]},
            //  {table:"qas",target:[]},{table:"conversations",target:[]},
              {table:"tasks",target:[{column:"task"}]}],
            //fuzziness:0,
            //prefix:"phrase"
            }
        )   
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.XATA_API_KEY}`
          },
            body: body  // body data type must match "Content-Type" header
        }
    const URL= process.env.XATA_URL+"/search"
    const response = await fetch(URL, options);
    if (response.ok) {
        const data = await response.json()
        if (data.records.length>0) {
            console.log("f(getTask_Description): ",JSON.stringify(data.records[0]))
            const model = data.records[0]?.model
            console.log("f(getTask_Description): model=",model)
            const task_description = data.records[0]?.task_description
            const task = data.records[0]?.task
            return {task:task,model:model,task_description:task_description}
        } else {
            return null
        }
    } else {
        console.log("Error searching record in tasks table",await response.json())
        return null
    }
}



export default db
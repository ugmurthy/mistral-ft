import {readFileSync,writeFileSync, unlink} from "node:fs"

export function delete_file(fname) {
    unlink(fname,(err)=>{
        console.log("Error : deleting file ",fname)
    })
} 

export function read_file(fname) {
    try {
        const data = readFileSync(fname,'utf-8');
        return data
    } catch (e) {
        console.log("Error: Reading file: ",fname)
        return null
    }
}

export function write_file(fname, text) {
    try {
        writeFileSync(fname,text,'utf-8');
        return true
    } catch (e){
        console.log("Error: Writing file ",fname)
        return false;
    }
        
}
import React, { useEffect, useState } from 'react'

function Plist({p,c,s,q,i}) {
  const [dataArray,setDataArray]=useState([])
  const data = {p,c,s,q,i};

  useEffect(()=>{
    if (p) {
        setDataArray(prevDataArray => [...prevDataArray, data]);
    }
  },[p])

  return (
    <div>Array Size {dataArray.length}
    <div>{JSON.stringify(dataArray[0])}</div>
    <div>{JSON.stringify(dataArray[1])}</div>
    
    </div>
  )
}

export default Plist
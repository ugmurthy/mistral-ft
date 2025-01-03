import React, { useEffect,useState, useRef } from 'react';
//import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import pkg from 'vis-network/standalone/esm/vis-network.js';
const { DataSet, Network } = pkg;
const VisNetwork = () => {
  // Reference to hold the div where vis will render the network
  const visJsRef = useRef(null);
  const [nodes, setNodes] = useState(new DataSet([
    { id: 1, label: 'Node 1' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' }
    ]));
    const [edges, setEdges] = useState(new DataSet([
        { from: 1, to: 3 },
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 2, to: 5 }
        ]));
  // Create nodes
  

  function add() {
    nodes.add({ id: 6, label: 'New Node 6' });
    edges.add({ from: 5, to: 6 });
    setNode(nodes);
    setEdges(edges);
  }

  function remove() {
    nodes.remove({ id: 6 });
    edges.remove({ from: 5, to: 6 });
    setEdges(edges);
    setNodes(nodes);
  }

  useEffect(() => {
    // Create data sets for nodes and edges
    
    // Combine nodes and edges into one data object
    const data = {
      nodes: nodes,
      edges: edges
    };

    // Options for the network
    const options = {};

    // Initialize the network only if the ref has been assigned
    if (visJsRef.current) {
      const network = new Network(visJsRef.current, data, options);
      // Here you can add event listeners, etc.
    }
  }, [visJsRef]); // The effect runs only when visJsRef changes

  return (
        <div>
            <button className="btn btn-xs btn-success " onClick={add}>Add Node</button>
            <button className="btn btn-xs btn-error " onClick={remove}>Remove Node</button>
            <h1>Vis Network</h1>
            <div ref={visJsRef} style={{ width: '100%', height: '400px' }}></div>
            

        </div>
  ) 
};

export default VisNetwork;

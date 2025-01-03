import  { useState, useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import 'vis-network/styles/vis-network.min.css';

const VisNetwork = () => {
  const visJsRef = useRef(null);
  const [network, setNetwork] = useState(null);
  const [nodes, setNodes] = useState(new DataSet([
    { id: 1, label: 'Node 1','title': 'Gemini Flash 1.5 8b Exp'},
    { id: 2, label: 'Node 2' ,'title': 'Mistral Codestral Mamba'},
  ]));
  const [edges, setEdges] = useState(new DataSet([
    { from: 1, to: 2, arrows: 'to', label: 'Summary'},
  ]));
  
  // Initialize the network
  useEffect(() => {
    if (visJsRef.current) {
      const data = {
        nodes: nodes,
        edges: edges
      };
      const options = {
        edges: {
          color: '#000000',
          arrows: {
            to: { enabled: true, scaleFactor: 1, type: 'arrow' },
          },
        },
        interaction: {multiselect: true, keyboard: true},
      }
      
      const newNetwork = new Network(visJsRef.current, data, options);
      setNetwork(newNetwork);

      // Cleanup on unmount
      return () => {
        if (newNetwork) {
          newNetwork.destroy();
        }
      };
    }
  }, [visJsRef,nodes,edges]);

  // Function to add a node
  const addNode = () => {
    const newId = nodes.length + 1;
    nodes.add({ id: newId, label: `Node ${newId}` });
    console.log("addNode: ",nodes.get());
    setNodes(new DataSet(nodes.get())); // Update state to force re-render
  };

  // Function to modify a node (change label)
  const modifyNode = () => {
    const selectedNode = network.getSelectedNodes()[0];
    if (selectedNode) {
      nodes.update({ id: selectedNode, label: `Modified Node ${selectedNode}` });
      console.log("modifyNode: ",nodes.get());
      setNodes(new DataSet(nodes.get())); // Update state to force re-render
    }
  };

  // Function to delete a node
  const deleteNode = () => {
    const selectedNode = network.getSelectedNodes()[0];
    if (selectedNode) {
      nodes.remove({ id: selectedNode });
      console.log("delNode: ",nodes.get());
      setNodes(new DataSet(nodes.get())); // Update state to force re-render
    }
  };

  // Function to add an edge
  const addEdge = () => {
    const selectedNodes = network.getSelectedNodes();
    if (selectedNodes.length === 2) {
      edges.add({ from: selectedNodes[0], to: selectedNodes[1] });
      console.log("addEdge: ",edges.get());
      setEdges(new DataSet(edges.get())); // Update state to force re-render
    }
  };

  // Function to modify an edge (change color)
  const modifyEdge = () => {
    const selectedEdge = network.getSelectedEdges()[0];
    if (selectedEdge) {
      edges.update({ id: selectedEdge, color: 'red' });
      console.log("modifyEdge: ",edges.get());
      setEdges(new DataSet(edges.get())); // Update state to force re-render
    }
  };

  // Function to delete an edge
  const deleteEdge = () => {
    const selectedEdge = network.getSelectedEdges()[0];
    if (selectedEdge) {
      edges.remove({ id: selectedEdge });
      console.log("removeEdge: ",edges.get());
      setEdges(new DataSet(edges.get())); // Update state to force re-render
    }
  };

  return (
    <div>
    <div className='flex space-x-2'>
      <div className='px-4 flex space-x-2'>
        <button className="btn btn-primary btn-xs" onClick={addNode}>Add Node</button>
        <button className="btn btn-primary btn-xs" onClick={modifyNode}>Modify Node</button>
        <button className="btn btn-primary btn-xs" onClick={deleteNode}>Delete Node</button>
      </div>
      <div className='px-4 flex space-x-2'>
        <button className="btn btn-secondary btn-xs" onClick={addEdge}>Add Edge</button>
        <button className="btn btn-secondary btn-xs" onClick={modifyEdge}>Modify Edge</button>
        <button className="btn btn-secondary btn-xs" onClick={deleteEdge}>Delete Edge</button>
      </div>
      </div>
  
      <div ref={visJsRef} style={{ height: "600px", width: "100%" }} />
    </div>
  );
};

export default VisNetwork;

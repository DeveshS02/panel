import React, { useState, useEffect } from 'react';
import DetailedNode from './DetailedNode';

const DisplayNodes = () => {
  const [data, setData] = useState({ tank: {}, borewell: {}, water: {} });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null); // To handle selected node

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tankResponse = await fetch('https://api-gateway-green.vercel.app/water/tankerdata');
        const borewellResponse = await fetch('https://api-gateway-green.vercel.app/water/borewelldata');
        const waterResponse = await fetch('https://api-gateway-green.vercel.app/water/waterminutesdatas');

        const tankData = await tankResponse.json();
        const borewellData = await borewellResponse.json();
        const waterData = await waterResponse.json();

        const newData = {
          tank: typeof tankData === 'object' && !Array.isArray(tankData) ? tankData : {},
          borewell: typeof borewellData === 'object' && !Array.isArray(borewellData) ? borewellData : {},
          water: typeof waterData === 'object' && !Array.isArray(waterData) ? waterData : {},
        };

        setData(newData);
        setLoading(false);
        console.log('Fetched data:', newData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderCards = (dataObject, type) => {
    if (typeof dataObject !== 'object' || Array.isArray(dataObject)) return null;

    return Object.entries(dataObject).map(([itemName, itemAttributes], index) => (
      <div key={index} className="card text-black">
        <button onClick={() => setSelectedNode({ itemName, itemAttributes, type })}>
          <h3 className="text-xl text-center">{itemName}</h3>
          {/* <p>Type of Node: {type}</p> */}
          <ul>
            {itemAttributes &&
              Object.entries(itemAttributes).map(([key, value]) => (
                key !== 'created_at' && key !== 'nodeID' && (
                  <li key={key}>
                    {key}: {value}
                  </li>
                )
              ))}
          </ul>
        </button>
      </div>
    ));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (selectedNode) {
    return <DetailedNode node={selectedNode} goBack={() => setSelectedNode(null)} />;
  }

  return (
    <div className="grid grid-cols-3 gap-4 px-4">
      <h1 className="text-blue-700 text-2xl col-span-3 mt-1">Tank Data</h1>
      {renderCards(data.tank, 'Water Tank')}

      <h1 className="text-blue-700 text-2xl col-span-3 mt-1">Borewell Data</h1>
      {renderCards(data.borewell, 'Borewell')}

      <h1 className="text-blue-700 text-2xl col-span-3 mt-1">Water Data</h1>
      {renderCards(data.water, 'Water Meter')}
    </div>
  );
};

export default DisplayNodes;

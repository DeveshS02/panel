import React, { useState, useEffect } from 'react';
import DetailedNode from './DetailedNode';
import { useSelector } from 'react-redux'

const DisplayNodes = () => {
  const [data, setData] = useState({ tank: {}, borewell: {}, water: {} });
  const [loc,setLoc]= useState({ tank: [], borewell: [], water: [] });
  const [longData, setLongData] = useState({ tank:{}, borewell: {}, water: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null); // To handle selected node
  const location = useSelector((state) => state.location);

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
          tank: tankData,
          borewell: borewellData,
          water: waterData,
        };

        setData(newData);
        setLoading(false);
      
        const tankLoc = await fetch('https://api-gateway-green.vercel.app/water/staticnodesC');
        const borewellLoc = await fetch('https://api-gateway-green.vercel.app/water/borewellnodesC');
        const waterLoc = await fetch('https://api-gateway-green.vercel.app/water/waterC');

        const tankL = await tankLoc.json();
        const borewellL = await borewellLoc.json();
        const waterL = await waterLoc.json();

        const newDataL = {
          tank: tankL,
          borewell: borewellL,
          water: waterL,
        };

        setLoc(newDataL);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const tankResponse = await fetch('https://api-gateway-green.vercel.app/water/tankdata');
            const borewellResponse = await fetch('https://api-gateway-green.vercel.app/water/borewellgraphC');
            const waterResponse = await fetch('https://api-gateway-green.vercel.app/water/latestwaterC');

            const tankData = await tankResponse.json();
            const borewellData = await borewellResponse.json();
            const waterData = await waterResponse.json();

            const processData = (data) => {
                const currentDay = new Date();
                currentDay.setHours(0, 0, 0, 0); // Set to the start of the current day
            
                const activityByNode = {};
            
                for (const node in data) {
                    const activityByHour = Array(24).fill(false); // Initialize array to track activity for this node
            
                    data[node].forEach(entry => {
                        const entryDate = new Date(entry.created_at);
                        if (entryDate >= currentDay) {
                            const hour = entryDate.getHours();
                            activityByHour[hour] = true;
                        }
                    });
            
                    activityByNode[node] = activityByHour;
                }
            
                return activityByNode;
            };
            

            const newData = {
                tank: processData(tankData),
                borewell: processData(borewellData),
                water: processData(waterData),
            };

            setLongData(newData);
            console.log(newData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, []);

  const createLocationMap = (locData) => {
    const locationMap = {};

    ['tank', 'borewell', 'water'].forEach((type) => {
      locData[type].forEach((node) => {
        if (!locationMap[node.location]) {
          locationMap[node.location] = [];
        }
        locationMap[node.location].push(node.name);
      });
    });

    return locationMap;
  };

  const locationMap = createLocationMap(loc);
  
  const renderCards = (dataObject, type) => {
    if (typeof dataObject !== 'object' || Array.isArray(dataObject)) return null;
  
    const locationNodes = (location && location !== "All") ? locationMap[location] || [] : Object.keys(dataObject);
  
    return Object.entries(dataObject).map(([itemName, itemAttributes], index) => {
      if (location && location !== "All" && !locationNodes.includes(itemName)) {
        return null;
      }
  
      return (
        <div key={index} className="card text-black">
          <button onClick={() => setSelectedNode({ itemName, itemAttributes, type })}>
            <h3 className="text-xl text-center">{itemName}</h3>
            <ul>
              {itemAttributes &&
                Object.entries(itemAttributes).map(([key, value]) =>
                  key !== 'created_at' && key !== 'nodeID' ? (
                    <li key={key}>
                      {key}: {value}
                    </li>
                  ) : null
                )}
            </ul>
          </button>
        </div>
      );
    });
  };
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (selectedNode) {
    return <DetailedNode node={selectedNode} goBack={() => setSelectedNode(null)} data={longData} />;
  }

  return (
    <div className="grid grid-cols-3 gap-4 px-4">
      <h1 className="text-blue-700 text-2xl col-span-3 mt-1">Tank Data</h1>
      {renderCards(data.tank, 'tank')}

      <h1 className="text-blue-700 text-2xl col-span-3 mt-1">Borewell Data</h1>
      {renderCards(data.borewell, 'borewell')}

      <h1 className="text-blue-700 text-2xl col-span-3 mt-1">Water Data</h1>
      {renderCards(data.water, 'water')}
    </div>
  );
};

export default DisplayNodes;

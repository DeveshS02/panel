import React, { useState, useEffect } from 'react';

const YourComponent = () => {
  const [data, setData] = useState({ tank: {}, borewell: {}, water: {} });
  const [loading, setLoading] = useState(true); // Add a loading state

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
        setLoading(false); // Set loading to false after data is fetched
        console.log('Fetched data:', newData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchData();
  }, []);

  const renderData = (dataObject) => {
    if (typeof dataObject !== 'object' || Array.isArray(dataObject)) return null;

    return Object.entries(dataObject).map(([itemName, itemAttributes], index) => (
      <div key={index}>
        <h3 className='text-xl text-red-600'>{itemName}</h3>
        <ul>
          {itemAttributes &&
            Object.entries(itemAttributes).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
        </ul>
      </div>
    ));
  };

  if (loading) {
    return <div>Loading...</div>; // Render loading message while data is being fetched
  }

  return (
    <div className='text-yellow-700 m-3'>
      <h1 className='text-blue-700 text-2xl'> Tank Data</h1>
      {renderData(data.tank)}

      <h1 className='text-blue-700 text-2xl'>Borewell Data</h1>
      {renderData(data.borewell)}

      <h1 className='text-blue-700 text-2xl'>Water Data</h1>
      {renderData(data.water)}
    </div>
  );
};

export default YourComponent;

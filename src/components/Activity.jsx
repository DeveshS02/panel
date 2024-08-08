import React, { useState, useEffect } from 'react'

const Tile = ({ active, neutral }) => {
    const tileStyle = {
        width: '20px',
        height: '20px',
        margin: '2px',
        backgroundColor: neutral ? 'gray' : active ? 'green' : 'red',
    };

    return <div style={tileStyle}></div>;
};

const NodeHealth = ({ data }) => {
    const currentHour = new Date().getHours();

    return (
        <div>
            {Object.keys(data).map(nodeType => (
                <div key={nodeType}>
                    <h3 className='text-blue-900 text-xl'>{nodeType}</h3>
                    {Object.keys(data[nodeType]).map(nodeName => (
                        <div key={nodeName}>
                            <h4 className='text-yellow-500 text-l'>{nodeName}</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
                                {data[nodeType][nodeName].map((active, index) => (
                                    <Tile key={index} active={active} neutral={index > currentHour} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};


const Activity = () => {
    const [data, setData] = useState({ tank: {}, borewell: {}, water: {} });

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

                setData(newData);
                console.log(newData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return <NodeHealth data={data} />;
}

export default Activity
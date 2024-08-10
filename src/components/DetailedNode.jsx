// // DetailedNode.jsx
// import React from "react";

// const DetailedNode = ({ node, goBack }) => {
//   const { itemName, itemAttributes, type } = node;
//   const createdAt = itemAttributes.created_at;
//   const nodeID = itemAttributes.nodeID;

//   return (
//     <div className="detailed-node-container">
//       <div className="detailed-node-header">
//         <h1 className="item-name">{itemName}</h1>
//         <button className="close-button" onClick={goBack}>
//           ✖
//         </button>
//       </div>
//       <div className="detailed-node-info">
//         <p className="node-type">Type: {type}</p>
//         <p className="node-id">Node ID: {nodeID}</p>
//       </div>
//       {/* <div className="boxi flex w-[100%] justify-center"> */}
//       <div className="detailed-node-attributes">
//         {itemAttributes &&
//           Object.entries(itemAttributes).map(
//             ([key, value]) =>
//               key !== "created_at" &&
//               key !== "nodeID" && (
//                 <div key={key} className="attribute">
//                   <span className="attribute-key">{key}</span>:
//                   <span className="attribute-value">{value}</span>
//                 </div>
//               )
//           )}
//       </div>
//       {/* </div> */}
//       <div className="toggle-container">
//         <span>Day</span>
//         <label className="toggle-switch mx-2">
//           <input type="checkbox" />
//           <span className="slider"></span>
//         </label>
//         <span>Hour</span>
//       </div>
//       <div className="performance-container">
//         <div className="flex justify-center">
//           <img
//             className=""
//             src="/Images/performance_scale1.jpg"
//             alt="Detailed chart"
//           />
//         </div>
//         <h2>Performance</h2>
//       </div>
//       <div className="last-updated">
//         <p>Last updated on</p>
//         <p>{createdAt}</p>
//       </div>
//     </div>
//   );
// };

// export default DetailedNode;

import React from "react";

const DetailedNode = ({ node, goBack, data }) => {
  const { itemName, itemAttributes, type } = node;
  const createdAt = itemAttributes.created_at;
  const nodeID = itemAttributes.nodeID;
  const currentHour = new Date().getHours();

  const Tile = ({ active, neutral }) => {
    const tileStyle = {
      width: "20px",
      height: "20px",
      margin: "2px",
      backgroundColor: neutral ? "gray" : active ? "green" : "red",
    };

    return <div style={tileStyle}></div>;
  };

  return (
    <div className="detailed-node-container">
      <div className="detailed-node-header">
        <h1 className="item-name">{itemName}</h1>
        <button className="close-button" onClick={goBack}>
          ✖
        </button>
      </div>
      <div className="detailed-node-info">
        <p className="node-type">Type: {type}</p>
        <p className="node-id">Node ID: {nodeID}</p>
      </div>
      {/* <div className="boxi flex w-[100%] justify-center"> */}
      <div className="detailed-node-attributes">
        {itemAttributes &&
          Object.entries(itemAttributes).map(
            ([key, value]) =>
              key !== "created_at" &&
              key !== "nodeID" && (
                <div key={key} className="attribute">
                  <span className="attribute-key">{key}</span>:
                  <span className="attribute-value">{value}</span>
                </div>
              )
          )}
      </div>
      {/* </div> */}
      <div className="toggle-container">
        <span>Day</span>
        <label className="toggle-switch mx-2">
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
        <span>Hour</span>
      </div>
      <div className="performance-container">
        <div className="flex justify-center">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "4px",
            }}
          >
            {data[type][itemName].map((active, index) => (
              <Tile key={index} active={active} neutral={index > currentHour} />
            ))}
          </div>
        </div>
        <h2>Performance</h2>
      </div>
      <div className="last-updated">
        <p>Last updated on</p>
        <p>{createdAt}</p>
      </div>
    </div>
  );
};

export default DetailedNode;

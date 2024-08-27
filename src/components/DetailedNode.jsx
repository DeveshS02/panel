// import React from "react";

// const DetailedNode = ({ node, goBack, data }) => {
//   const { itemName, itemAttributes, type } = node;
//   const createdAt = itemAttributes.created_at;
//   const nodeID = itemAttributes.nodeID;
//   const currentHour = new Date().getHours();

//   const Tile = ({ active, neutral }) => {
//     const tileStyle = {
//       width: "20px",
//       height: "20px",
//       margin: "2px",
//       backgroundColor: neutral ? "gray" : active ? "green" : "red",

//     };

//     return <div style={tileStyle}></div>;
//   };

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

//       <div className="detailed-node-attributes">
//         {itemAttributes &&
//           Object.entries(itemAttributes).map(
//             ([key, value]) =>
//               key !== "created_at" &&
//               key !== "nodeID" &&
//               key !== "tanker" &&
//               key !== "borewell" &&
//               key !== "node" &&
//               key !== "pressurevoltage" && (
//                 <div key={key} className="attribute">
//                   <span className="attribute-key">{key}</span>:
//                   <span className="attribute-value">{value}</span>
//                 </div>
//               )
//           )}
//       </div>
//       <div className="performance-container">
//         <div className="flex justify-center">
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(6, 1fr)",
//               gap: "4px",
//             }}
//           >
//             {data[type][itemName].map((active, index) => (
//               <Tile key={index} active={active} neutral={index > currentHour} />
//             ))}
//           </div>
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
      background: neutral
        ? "gray"
        : active
        ? "linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))"
        : "linear-gradient(195deg, rgb(236, 64, 84), #d81b3a)",
    };
    return <div style={tileStyle}></div>;
  };

  return (
    <div className="absolute z-20 flex justify-center">
      <div className="detailedbox">
        <div className="detailedheading">
          <div className="detailedname">
            <div>{itemName}</div>
            <button className="close-button" onClick={goBack}>
              <svg
                className="close-icon"
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#ffffff"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z"
                    fill="#FFFFFF"
                  ></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
        <div className="flex ml-4 mr-8 pb-6 pt-6 justify-between gap-10">
          <div className="performance-container px-4 items-center justify-center">
            <div className="flex justify-center">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                  gap: "4px",
                }}
              >
                {data[type][itemName].map((active, index) => (
                  <Tile
                    key={index}
                    active={active}
                    neutral={index > currentHour}
                  />
                ))}
              </div>
            </div>
            <h2
              style={{
                color: "rgb(52, 71, 103)",
                fontSize: "19px",
                fontWeight: "700",
              }}
            >
              Performance
            </h2>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <div className="">
              <p className="node-type">Type of Device: {type}</p>
            </div>
            <div>
              <div className="detailed-node-attributes">
                {itemAttributes &&
                  Object.entries(itemAttributes).map(
                    ([key, value]) =>
                      key !== "created_at" &&
                      key !== "nodeID" &&
                      key !== "tanker" &&
                      key !== "borewell" &&
                      key !== "node" &&
                      key !== "pressurevoltage" && (
                        <div key={key} className="attribute">
                          <div className="flex flex-col items-center">
                            <span className="attribute-key">{key}</span>
                            <span
                              style={{
                                fontWeight: "400",
                                fontSize: "14px",
                                letterSpacing: "0.5px",
                              }}
                            >
                              in L
                            </span>
                          </div>

                          <span className="attribute-value">{value}</span>
                        </div>
                      )
                  )}
              </div>
            </div>
            {/* <div className="last-updated">
              <p>Last updated on</p>
              <p>{createdAt}</p>
            </div> */}
            <div className="flex items-center gap-2 ">
              <svg
                width="17px"
                height="17px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                    stroke="#344767"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                  <path
                    d="M12 6V12"
                    stroke="#344767"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                  <path
                    d="M16.24 16.24L12 12"
                    stroke="#344767"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                </g>
              </svg>
              <p style={{ color: "#344767", fontWeight: "400" }} className="">
                Last updated at {createdAt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedNode;

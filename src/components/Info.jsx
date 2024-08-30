// import React, { useState } from "react";
// import Control from "./Control";
// import DisplayNodes from "./DisplayNodes";
// import Stats from "./Stats";

// const Info = () => {
//   const [selectedType, setSelectedType] = useState("All");
//   const [selectedActivity, setSelectedActivity] = useState("All");
//   const [loading, setLoading] = useState(true);

//   return (
//     <div className="flex flex-col">
//       <div className="top mt-5 h-[9.5vh] flex justify-center items-center">
//         <Control
//           selectedType={selectedType}
//           setSelectedType={setSelectedType}
//           selectedActivity={selectedActivity}
//           setSelectedActivity={setSelectedActivity}
//         />
//       </div>
//       <div>
//         <div className="nodes mt-5 h-[80vh] overflow-scroll overflow-x-hidden pb-1">
//           <div className="ml-4">
//           {!loading && <Stats />}
//           </div>
//           <DisplayNodes
//             selectedType={selectedType}
//             selectedActivity={selectedActivity}
//             setLoader={setLoading}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Info;

import React, { useState } from "react";
import Control from "./Control";
import DisplayNodes from "./DisplayNodes";
import Stats from "./Stats";
import DetailedNode from "./DetailedNode";

const Info = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedActivity, setSelectedActivity] = useState("All");
  const [loading, setLoading] = useState(true);
  const [longData, setLongData] = useState({
    tank: {},
    borewell: {},
    water: {},
  });
  //now
  const [selectedNode, setSelectedNode] = useState(null);
  console.log(selectedNode);
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-[100%]">
        <div className="top mt-5 h-[9.5vh] flex justify-center items-center">
          <Control
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
          />
        </div>
        <div>
          <div className="nodes mt-5 h-[80vh] overflow-scroll overflow-x-hidden pb-1">
            <div className="ml-4">{!loading && <Stats />}</div>
            <DisplayNodes
              selectedType={selectedType}
              selectedActivity={selectedActivity}
              setLoader={setLoading}
              setSelectedNode={setSelectedNode}
              setLongData={setLongData}
              selectedNode={selectedNode}
            />
            {/* Overlay DetailedNode component */}
          </div>
        </div>
      </div>
      {selectedNode && (
        <DetailedNode
          node={selectedNode}
          goBack={() => setSelectedNode(null)}
          data={longData}
        />
      )}
    </div>
  );
};

export default Info;

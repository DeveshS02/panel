import React, { useState, useEffect } from "react";
import DetailedNode from "./DetailedNode";
import Card from "./NodeCard";
import { parse, isBefore, format } from 'date-fns';
import { useSelector, useDispatch } from "react-redux";
import { setActiveCount, setInactiveCount } from "../redux/counterSlice";

const DisplayNodes = ({ selectedType, selectedActivity, setLoader, setSelectedNode, setLongData, selectedNode }) => {
  const [data, setData] = useState({ tank: {}, borewell: {}, water: {} });
  const [loc, setLoc] = useState({ tank: [], borewell: [], water: [] });
  // const [longData, setLongData] = useState({tank: {}, borewell: {}, water: {}});
  // const [merger, setMerger] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useSelector((state) => state.location);
  // const [selectedNode, setSelectedNode] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tankResponse = await fetch(
          "https://api-gateway-green.vercel.app/water/tankerdata"
        );
        const borewellResponse = await fetch(
          "https://api-gateway-green.vercel.app/water/borewelldata"
        );
        const waterResponse = await fetch(
          "https://api-gateway-green.vercel.app/water/waterminutesdatas"
        );

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

        const tankLoc = await fetch(
          "https://api-gateway-green.vercel.app/water/staticnodesC"
        );
        const borewellLoc = await fetch(
          "https://api-gateway-green.vercel.app/water/borewellnodesC"
        );
        const waterLoc = await fetch(
          "https://api-gateway-green.vercel.app/water/waterC"
        );

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
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tankResponse = await fetch(
          "https://api-gateway-green.vercel.app/water/tankdata"
        );
        const borewellResponse = await fetch(
          "https://api-gateway-green.vercel.app/water/borewellgraphC"
        );
        const waterResponse = await fetch(
          "https://api-gateway-green.vercel.app/water/latestwaterC"
        );

        const tankData = await tankResponse.json();
        const borewellData = await borewellResponse.json();
        const waterData = await waterResponse.json();

        const newDate = {
          tank: tankData,
          borewell: borewellData,
          water: waterData,
        };

        const merger = (data1, data2) => {
          for (const nodeType in data1) {
            for (const node in data1[nodeType]) {
              const latestEntryData1 = data1[nodeType][node][data1[nodeType][node].length - 1];
              const entryData2 = data2[nodeType][node];

              // Define the date formats
              const formatData1 = 'MM/dd/yyyy, HH:mm:ss';
              const formatData2 = 'dd-MM-yyyy HH:mm:ss';

              if(latestEntryData1 && entryData2){

                const latestCreatedAtData1 = parse(latestEntryData1.created_at, formatData1, new Date());
                const createdAtData2 = parse(entryData2.created_at, formatData2, new Date());

                if (isBefore(latestCreatedAtData1, createdAtData2)) {
                  entryData2.Last_Updated = format(createdAtData2, formatData1);
                  data1[nodeType][node].push(entryData2);
                }
              }

            }
          }

          return data1;
        }

        merger(newDate,data);

        const processData = (data) => {
          const startTime = new Date(); // Start time will be set to midnight of the previous day
          startTime.setHours(0, 0, 0, 0);
          startTime.setDate(startTime.getDate()); // Set to midnight of the previous day

          const activityByNode = {};

          for (const node in data) {
            // Initialize array for 48 half-hour periods
            const activityByPeriod = Array(48).fill(false);

            data[node].forEach((entry) => {
              const entryDate = new Date(entry.created_at);
              if (entryDate >= startTime) {
                // Calculate the difference in minutes from the start time
                const timeDifferenceInMinutes = (entryDate - startTime) / (1000 * 60);

                // Calculate the 30-minute period index (ranges from 0 to 47)
                const periodIndex = Math.floor(timeDifferenceInMinutes / 30);
                if (periodIndex >= 0 && periodIndex < 48) {
                  activityByPeriod[periodIndex] = true;
                }
              }
            });

            activityByNode[node] = activityByPeriod;
          }

          return activityByNode;
        };

        const newData = {
          tank: processData(newDate.tank),
          borewell: processData(newDate.borewell),
          water: processData(newDate.water),
        };

        setLongData(newData);
        setMerger(true)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data]);

  const createLocationMap = (locData) => {
    const locationMap = {};

    ["tank", "borewell", "water"].forEach((type) => {
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

  const filterCards = (dataObject, type) => {
    if (typeof dataObject !== "object" || Array.isArray(dataObject))
      return null;
    const locationNodes =
      location && location !== "All"
        ? locationMap[location] || []
        : Object.keys(dataObject);

    return Object.entries(dataObject).map(
      ([itemName, itemAttributes], index) => {
        if (
          location &&
          location !== "All" &&
          !locationNodes.includes(itemName)
        ) {
          return null;
        }
        const createdAt = itemAttributes.created_at;
        const [datePart, timePart] = createdAt.split(" ");
        const [day, month, year] = datePart.split("-");
        const formattedDate = `${year}-${month}-${day}T${timePart}`;

        const lastItemDate = new Date(formattedDate);
        const now = new Date();
        const differenceInMilliseconds = now.getTime() - lastItemDate.getTime();
        const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

        let isActive = differenceInHours <= 1 ? 1 : 0;

        const shouldDisplay =
          selectedActivity === "All" ||
          (isActive && selectedActivity === "Active") ||
          (!isActive && selectedActivity === "Inactive");

        if (shouldDisplay) {
          return (
            <Card
              key={index}
              itemName={itemName}
              itemAttributes={itemAttributes}
              type={type}
              setSelectedNode={setSelectedNode}
              activityy={isActive}
            />
          );
        }

        return null;
      }
    );
  };

  let activeCounter = 0;
  let inactiveCounter = 0;

  const countActivity = (dataObject) => {
    Object.entries(dataObject).forEach(([itemName, itemAttributes]) => {
      const createdAt = itemAttributes.created_at;
      const [datePart, timePart] = createdAt.split(" ");
      const [day, month, year] = datePart.split("-");
      const formattedDate = `${year}-${month}-${day}T${timePart}`;

      const lastItemDate = new Date(formattedDate);
      const now = new Date();
      const differenceInMilliseconds = now.getTime() - lastItemDate.getTime();
      const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

      if (differenceInHours >= 1) inactiveCounter++;
      else activeCounter++;
    });
  };

  useEffect(() => {
    if (!loading) {
      countActivity(data.borewell);
      countActivity(data.water);
      countActivity(data.tank);

      dispatch(setActiveCount(activeCounter));
      dispatch(setInactiveCount(inactiveCounter));

      setLoader(false); // Set loader here to avoid updating state during render
    }
  }, [loading, data, dispatch, setLoader]); // Include dependencies

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[100%] flex justify-center">
      {/* Blurred DisplayNodes component */}
      <div className={`cards px-4 mt-4 w-[100%] ${selectedNode ? "blur-sm" : ""}`}>
        {(selectedType === "All" || selectedType === "Water Tank") && (
          <>
            <h1 className="typeheading">Water Tank</h1>
            <div className="grid mt-2">{filterCards(data.tank, "tank")}</div>
          </>
        )}
        {(selectedType === "All" || selectedType === "Borewell") && (
          <>
            <h1 className="typeheading">Borewell</h1>
            <div className="grid mt-2">{filterCards(data.borewell, "borewell")}</div>
          </>
        )}
        {(selectedType === "All" || selectedType === "Water Meter") && (
          <>
            <h1 className="typeheading">Water Meter</h1>
            <div className="grid mt-2">{filterCards(data.water, "water")}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default DisplayNodes;

// import React, { useState, useEffect } from "react";
// import Card from "./NodeCard";
// import { useSelector, useDispatch } from "react-redux";
// import { setActiveCount, setInactiveCount } from "../redux/counterSlice";

// const DisplayNodes = ({
//   selectedType,
//   selectedActivity,
//   setLoader,
//   setSelectedNode,
//   setLongData,
//   selectedNode,
// }) => {
//   const [data, setData] = useState({ tank: {}, borewell: {}, water: {} });
//   const [loc, setLoc] = useState({ tank: [], borewell: [], water: [] });
//   const [loading, setLoading] = useState(true);
//   const location = useSelector((state) => state.location);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const tankResponse = await fetch(
//           "https://api-gateway-green.vercel.app/water/tankerdata"
//         );
//         const borewellResponse = await fetch(
//           "https://api-gateway-green.vercel.app/water/borewelldata"
//         );
//         const waterResponse = await fetch(
//           "https://api-gateway-green.vercel.app/water/waterminutesdatas"
//         );

//         const tankData = await tankResponse.json();
//         const borewellData = await borewellResponse.json();
//         const waterData = await waterResponse.json();

//         const newData = {
//           tank: tankData,
//           borewell: borewellData,
//           water: waterData,
//         };

//         setData(newData);
//         setLoading(false);

//         const tankLoc = await fetch(
//           "https://api-gateway-green.vercel.app/water/staticnodesC"
//         );
//         const borewellLoc = await fetch(
//           "https://api-gateway-green.vercel.app/water/borewellnodesC"
//         );
//         const waterLoc = await fetch(
//           "https://api-gateway-green.vercel.app/water/waterC"
//         );

//         const tankL = await tankLoc.json();
//         const borewellL = await borewellLoc.json();
//         const waterL = await waterLoc.json();

//         const newDataL = {
//           tank: tankL,
//           borewell: borewellL,
//           water: waterL,
//         };

//         setLoc(newDataL);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const tankResponse = await fetch(
//           "https://api-gateway-green.vercel.app/water/tankdata"
//         );
//         const borewellResponse = await fetch(
//           "https://api-gateway-green.vercel.app/water/borewellgraphC"
//         );
//         const waterResponse = await fetch(
//           "https://api-gateway-green.vercel.app/water/latestwaterC"
//         );

//         const tankData = await tankResponse.json();
//         const borewellData = await borewellResponse.json();
//         const waterData = await waterResponse.json();

//         const processData = (data) => {
//           const currentDay = new Date();
//           currentDay.setHours(0, 0, 0, 0); // Set to the start of the current day

//           const activityByNode = {};

//           for (const node in data) {
//             const activityByHour = Array(24).fill(false); // Initialize array to track activity for this node

//             data[node].forEach((entry) => {
//               const entryDate = new Date(entry.created_at);
//               if (entryDate >= currentDay) {
//                 const hour = entryDate.getHours();
//                 activityByHour[hour] = true;
//               }
//             });

//             activityByNode[node] = activityByHour;
//           }

//           return activityByNode;
//         };

//         const newData = {
//           tank: processData(tankData),
//           borewell: processData(borewellData),
//           water: processData(waterData),
//         };

//         setLongData(newData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [setLongData]);

//   const createLocationMap = (locData) => {
//     const locationMap = {};

//     ["tank", "borewell", "water"].forEach((type) => {
//       locData[type].forEach((node) => {
//         if (!locationMap[node.location]) {
//           locationMap[node.location] = [];
//         }
//         locationMap[node.location].push(node.name);
//       });
//     });

//     return locationMap;
//   };

//   const locationMap = createLocationMap(loc);

//   const filterCards = (dataObject, type) => {
//     if (typeof dataObject !== "object" || Array.isArray(dataObject))
//       return null;
//     const locationNodes =
//       location && location !== "All"
//         ? locationMap[location] || []
//         : Object.keys(dataObject);

//     return Object.entries(dataObject).map(
//       ([itemName, itemAttributes], index) => {
//         if (
//           location &&
//           location !== "All" &&
//           !locationNodes.includes(itemName)
//         ) {
//           return null;
//         }
//         const createdAt = itemAttributes.created_at;
//         const [datePart, timePart] = createdAt.split(" ");
//         const [day, month, year] = datePart.split("-");
//         const formattedDate = `${year}-${month}-${day}T${timePart}`;

//         const lastItemDate = new Date(formattedDate);
//         const now = new Date();
//         const differenceInMilliseconds = now.getTime() - lastItemDate.getTime();
//         const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

//         let isActive = differenceInHours <= 1 ? 1 : 0;

//         const shouldDisplay =
//           selectedActivity === "All" ||
//           (isActive && selectedActivity === "Active") ||
//           (!isActive && selectedActivity === "Inactive");

//         if (shouldDisplay) {
//           return (
//             <Card
//               key={index}
//               itemName={itemName}
//               itemAttributes={itemAttributes}
//               type={type}
//               setSelectedNode={setSelectedNode}
//               activityy={isActive}
//             />
//           );
//         }

//         return null;
//       }
//     );
//   };

//   let activeCounter = 0;
//   let inactiveCounter = 0;

//   const countActivity = (dataObject) => {
//     Object.entries(dataObject).forEach(([itemName, itemAttributes]) => {
//       const createdAt = itemAttributes.created_at;
//       const [datePart, timePart] = createdAt.split(" ");
//       const [day, month, year] = datePart.split("-");
//       const formattedDate = `${year}-${month}-${day}T${timePart}`;

//       const lastItemDate = new Date(formattedDate);
//       const now = new Date();
//       const differenceInMilliseconds = now.getTime() - lastItemDate.getTime();
//       const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

//       if (differenceInHours >= 1) inactiveCounter++;
//       else activeCounter++;
//     });
//   };

//   useEffect(() => {
//     if (!loading) {
//       countActivity(data.borewell);
//       countActivity(data.water);
//       countActivity(data.tank);

//       dispatch(setActiveCount(activeCounter));
//       dispatch(setInactiveCount(inactiveCounter));

//       setLoader(false); // Set loader here to avoid updating state during render
//     }
//   }, [loading, data, dispatch, setLoader]); // Include dependencies

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="w-[100%] flex justify-center">
//       {/* Blurred DisplayNodes component */}
//       <div
//         className={`cards px-4 mt-4 w-[100%] ${selectedNode ? "blur-sm" : ""}`}
//       >
//         {(selectedType === "All" || selectedType === "Water Tank") && (
//           <>
//             <h1 className="typeheading">Water Tank</h1>
//             <div className="grid mt-2">{filterCards(data.tank, "tank")}</div>
//           </>
//         )}
//         {(selectedType === "All" || selectedType === "Borewell") && (
//           <>
//             <h1 className="typeheading">Borewell</h1>
//             <div className="grid mt-2">
//               {filterCards(data.borewell, "borewell")}
//             </div>
//           </>
//         )}
//         {(selectedType === "All" || selectedType === "Water Meter") && (
//           <>
//             <h1 className="typeheading">Water Meter</h1>
//             <div className="grid mt-2">{filterCards(data.water, "water")}</div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DisplayNodes;

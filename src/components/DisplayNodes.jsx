import React, { useState, useEffect } from "react";
import DetailedNode from "./DetailedNode";
import Card from "./NodeCard";
import { useSelector } from "react-redux";

const DisplayNodes = ({ selectedType, selectedActivity }) => {
  const [data, setData] = useState({ tank: {}, borewell: {}, water: {} });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loc, setLoc] = useState({ tank: [], borewell: [], water: [] });
  const [longData, setLongData] = useState({
    tank: {},
    borewell: {},
    water: [],
  });
  const location = useSelector((state) => state.location);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const tankResponse = await fetch(
  //         "https://api-gateway-green.vercel.app/water/tankerdata"
  //       );
  //       const borewellResponse = await fetch(
  //         "https://api-gateway-green.vercel.app/water/borewelldata"
  //       );
  //       const waterResponse = await fetch(
  //         "https://api-gateway-green.vercel.app/water/waterminutesdatas"
  //       );

  //       const tankData = await tankResponse.json();
  //       const borewellData = await borewellResponse.json();
  //       const waterData = await waterResponse.json();

  //       const newData = {
  //         tank:
  //           typeof tankData === "object" && !Array.isArray(tankData)
  //             ? tankData
  //             : {},
  //         borewell:
  //           typeof borewellData === "object" && !Array.isArray(borewellData)
  //             ? borewellData
  //             : {},
  //         water:
  //           typeof waterData === "object" && !Array.isArray(waterData)
  //             ? waterData
  //             : {},
  //       };

  //       setData(newData);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

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

        const processData = (data) => {
          const currentDay = new Date();
          currentDay.setHours(0, 0, 0, 0); // Set to the start of the current day

          const activityByNode = {};

          for (const node in data) {
            const activityByHour = Array(24).fill(false); // Initialize array to track activity for this node

            data[node].forEach((entry) => {
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
        // console.log(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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

        let isactive = 0;
        if (differenceInHours <= 1) {
          isactive = 1;
        }
        const shouldDisplay =
          selectedActivity === "All" ||
          (isactive && selectedActivity === "Active") ||
          (!isactive && selectedActivity === "Inactive");

        if (shouldDisplay) {
          return (
            <Card
              key={index}
              itemName={itemName}
              itemAttributes={itemAttributes}
              type={type}
              setSelectedNode={setSelectedNode}
              activityy={isactive}
            />
          );
        }

        return null;
      }
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (selectedNode) {
    return (
      <DetailedNode
        node={selectedNode}
        goBack={() => setSelectedNode(null)}
        data={longData}
      />
    );
  }

  return (
    <div className="grid px-4">
      {(selectedType === "All" || selectedType === "Water Tank") && (
        <>
          <h1 className="typeheading">Water Tank</h1>
          {filterCards(data.tank, "tank")}
        </>
      )}
      {(selectedType === "All" || selectedType === "Borewell") && (
        <>
          <h1 className="typeheading">Borewell</h1>
          {filterCards(data.borewell, "borewell")}
        </>
      )}
      {(selectedType === "All" || selectedType === "Water Meter") && (
        <>
          <h1 className="typeheading">Water Meter</h1>
          {filterCards(data.water, "water")}
        </>
      )}
    </div>
  );
};

export default DisplayNodes;

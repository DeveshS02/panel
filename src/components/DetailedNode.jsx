import React, { useState } from "react";

const DetailedNode = ({ node, goBack, data }) => {
  const { itemName, itemAttributes, type } = node;
  const createdAt = itemAttributes.created_at;
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentPeriodIndex = currentHour * 2 + Math.floor(currentMinutes / 30);

  // Tile Component with Hover Tooltip
  const Tile = ({ active, neutral, index }) => {
    const [hovered, setHovered] = useState(false);

    // Calculate the start time of the period
    const hours = Math.floor(index / 2);
    const minutes = (index % 2) * 30;

    // Format the time as HH:MM
    const startTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}`;

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    const tileStyle = {
      width: "20px",
      height: "20px",
      margin: "2px",
      background: neutral
        ? "gray"
        : active
        ? "linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))"
        : "linear-gradient(195deg, rgb(236, 64, 84), #d81b3a)",
      position: "relative",
    };

    return (
      <div
        style={tileStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Tooltip */}
        {hovered && (
          <div
            style={{
              position: "absolute",
              bottom: "100%", // Position above the tile
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              pointerEvents: "none", // Prevent blocking interaction
              zIndex: 20,
            }}
          >
            Start Time: {startTime}
          </div>
        )}
      </div>
    );
  };

  // Array to store the start time of each period
  const periods = Array.from({ length: 48 }, (_, index) => {
    const hours = Math.floor(index / 2);
    const minutes = (index % 2) * 30;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  });

  return (
    <div className="absolute z-20 flex justify-center align-middle">
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
                    fillRule="evenodd"
                    clipRule="evenodd"
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
            <div className="flex justify-center flex-col">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(9, 1fr)", // 8 columns for 48 periods + 1 column for time
                  gap: "3px",
                }}
              >
                {Array.from({ length: 6 }).map((_, rowIndex) => {
                  const timeIndex = rowIndex * 8; // Calculate the index for the time column

                  return (
                    <React.Fragment key={rowIndex}>
                      {/* Time Column */}
                      <div
                        style={{
                          textAlign: "left",
                          color: "rgb(52, 71, 103)",
                          paddingRight: "2px", // Add padding to align the time properly
                          fontSize: "14px"
                        }}
                      >
                        {periods[timeIndex]} {/* Display the start time */}
                      </div>

                      {/* Grid of Tiles */}
                      {data[type][itemName]
                        .slice(timeIndex, timeIndex + 8)
                        .map((active, index) => (
                          <Tile
                            key={timeIndex + index}
                            index={timeIndex + index} // Pass the index to calculate the start time
                            active={active}
                            neutral={timeIndex + index > currentPeriodIndex} // Updated neutral condition
                          />
                        ))}
                    </React.Fragment>
                  );
                })}
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
                  Object.entries(itemAttributes).map(([key, value]) => {
                    if (
                      key !== "created_at" &&
                      key !== "nodeID" &&
                      key !== "tanker" &&
                      key !== "borewell" &&
                      key !== "node" &&
                      key !== "pressurevoltage" &&
                      key !== "Last_Updated"
                    ) {
                      // Key mappings for labels
                      const keyLabelMapping = {
                        water_level: "Water Level",
                        totalflow: "Total Flow",
                        temp: "Temperature",
                        curr_volume: "Volume",
                        flowrate: "Flow Rate",
                        pressure: "Pressure",
                      };

                      // Units mapping
                      const unitMapping = {
                        water_level: "cm",
                        totalflow: "Litres",
                        temp: "°C",
                        curr_volume: "kL",
                        flowrate: "kL/hr",
                        pressure: "cbar",
                      };

                      const displayKey = keyLabelMapping[key] || key;
                      const unitLabel = unitMapping[key] || "";
                      const displayValue = unitMapping[key]
                        ? `${value} ${unitMapping[key]}`
                        : value;

                      return (
                        <div key={key} className="attribute">
                          <div className="flex flex-col items-center">
                            <span className="attribute-key">{displayKey}</span>
                            <span
                              style={{
                                fontWeight: "400",
                                fontSize: "14px",
                                letterSpacing: "0.5px",
                              }}
                            >
                              in {unitLabel}
                            </span>
                          </div>

                          <span className="attribute-value">
                            {displayValue}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
              </div>
            </div>
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

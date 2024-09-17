import React, { useState, useEffect } from "react";

const DetailedNode = ({ node, goBack, data }) => {
  const [geminiResponse, setGeminiResponse] = useState("");
  const { itemName, itemAttributes, type } = node;
  const createdAt = itemAttributes.created_at;
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentPeriodIndex = currentHour * 2 + Math.floor(currentMinutes / 30);

  const fetchGeminiData = async () => {
    try {
      // Format the recorded values into a readable sentence
      const recordedValues = itemAttributes
        ? Object.entries(itemAttributes)
            .filter(
              ([key]) =>
                ![
                  "created_at",
                  "nodeID",
                  "tanker",
                  "borewell",
                  "node",
                  "pressurevoltage",
                  "Last_Updated",
                ].includes(key)
            )
            .map(([key, value], index, array) => {
              const keyLabelMapping = {
                water_level: "Water Level",
                totalflow: "Total Flow",
                temp: "Temperature",
                curr_volume: "Volume",
                flowrate: "Flow Rate",
                pressure: "Pressure",
              };

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
              const displayValue = value;
              const first = index === 0;
              const isLastItem = index === array.length - 1;
              const isSecondLastItem = index === array.length - 2;

              if (isLastItem) {
                return first
                  ? `${displayKey} is ${displayValue} ${unitLabel}.`
                  : `and ${displayKey} is ${displayValue} ${unitLabel}. `;
              } else if (isSecondLastItem) {
                return `${displayKey} is ${displayValue} ${unitLabel} `;
              } else {
                return `${displayKey} is ${displayValue} ${unitLabel}, `;
              }
            })
            .join("")
        : "N/A";

      // Insert actual values into the prompt
      const prompt = `I want to generate a summary of the performance of a node. 
      Performance matrix for a node consists of:
      1) Activity rate: ${activePercentage.toFixed(2)}%
      2) Maximum continuous activity: ${(maxStreak / 2).toFixed(1)} hours
      3) Last updated time: ${lastUpdatedTime}
      4) Recorded values: ${recordedValues}.
      Please consider first 2 factors and then decide how the performance is. If the Activity rate is from 90% to 100% then the performance is excellent, if the Activity rate is between 70%-90% then it is good, if the activity rate is from 40% to 70% and the Maximum continuous activity is >= 5 hours then the performance is good if <5 hours then it is low, if the Activity rate is from 1% to 40% then it is performing very poor, if the Activity rate is 0% then write that the node stopped wokring. For example, if after processing 1 prompt response provided by you is- "Based on the provided information, the node's performance can be summarized as follows: *Activity Rate:* 60.42% *Maximum Continuous Activity:* 14.5 hours *Performance:* *Good* *Explanation:* The Activity rate of 60.42% falls within the range of 40% to 70%. Since the Maximum continuous activity is 14.5 hours, which is greater than 5 hours, the performance is considered *good. **Additional Information:* - *Last updated time:* 14-09-2024 14:35:38 - *Recorded values:* Water Level is 2 cm, Temperature is 31 °C and Volume is 2.3 kL." then I want that the displayed response should be in this format-"Activity Rate of the node is 60.42% with a Maximum Continuous Activity of 4.5 hours. As of the last update on 14-09-2024 14:35:38, the recorded Water Level is 2 cm, Temperature is 31 °C and Volume is 2.3 kL. Considering the node's activity,  performance of the node is good." Make sure that the response is in the provided format only. And the reponse should be grammatically and logically correct. Dont write anything in bold format.`;

      const response = await fetch("http://localhost:3001/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.json();
      setGeminiResponse(result.generatedText);
    } catch (error) {
      console.error("Error fetching Gemini data", error);
    }
  };

  // Only call fetchGeminiData when the component is first opened
  useEffect(() => {
    fetchGeminiData();
  }, []); // Empty dependency array ensures this runs only once on mount

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

  // Generate summary based on data
  const generateSummary = () => {
    const activePeriods = data[type][itemName];
    const activeCount = activePeriods.filter((active) => active).length;
    const totalPeriods = activePeriods.length;
    const activePercentage = (activeCount / totalPeriods) * 100;

    // Find the last updated value
    const lastUpdatedValue = itemAttributes ? itemAttributes.value : "N/A";

    // Analyze pattern (example: streak of active periods)
    let streakCount = 0;
    let maxStreak = 0;

    activePeriods.forEach((active) => {
      if (active) {
        streakCount++;
        if (streakCount > maxStreak) {
          maxStreak = streakCount;
        }
      } else {
        streakCount = 0;
      }
    });

    return {
      activeCount,
      activePercentage,
      lastUpdatedValue,
      maxStreak,
      lastUpdatedTime: createdAt,
    };
  };

  const {
    activeCount,
    activePercentage,
    lastUpdatedValue,
    maxStreak,
    lastUpdatedTime,
  } = generateSummary();

  return (
    <div className="absolute z-20 flex max-w-[70%] justify-center detailednode mr-1">
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
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z"
                  fill="#FFFFFF"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Summary Section */}
        <div className="flex ml-3 mr-3 pb-6 pt-6 justify-between gap-4">
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
                          fontSize: "12px",
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
                      const displayValue = value;

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

            <div className="flex items-center gap-2">
              <p> {geminiResponse || "Fetching Gemini data..."}</p>
              <div className="summary-section"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedNode;

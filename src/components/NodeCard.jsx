import React from "react";

const Card = ({
  itemName,
  itemAttributes,
  type,
  setSelectedNode,
  activityy,
}) => {
  const cardClassName = activityy ? "activecard" : "inactivecard";
  const svgStrokeColor = activityy ? "#43a047" : "#d81b3a";
  const createdAt = itemAttributes?.created_at;

  return (
    <div
      className={`${cardClassName} card text-black hover:scale-105 transform transition-transform duration-300 ease-in-out`}
    >
      <button
        className="w-full flex flex-col justify-center items-center gap-3"
        onClick={() => setSelectedNode({ itemName, itemAttributes, type })}
      >
        <div className="itemheading w-full ">
          <h3 className="text-xl text-center itemname">{itemName}</h3>
        </div>
        <ul className="flex flex-col gap-2">
  {itemAttributes &&
    Object.entries(itemAttributes).map(([key, value]) => {
      if (
        key !== "created_at" &&
        key !== "nodeID" &&
        key !== "tanker" &&
        key !== "borewell" &&
        key !== "node" &&
        key !== "pressurevoltage" &&
        key !== "temp" &&
        key !== "curr_volume" &&
        key !== "flowrate" &&
        key !== "pressure"
      ) {
        // Key mappings for labels
        const keyLabelMapping = {
          water_level: "Water Level",
          totalflow: "Total Flow",
        };

        // Units mapping
        const unitMapping = {
          water_level: "cm",
          totalflow: "Litres",
        };

        // Get the label for the key
        const displayKey = keyLabelMapping[key] || key;

        // Add unit to value if it matches a key in unitMapping
        const displayValue = unitMapping[key] ? `${value} ${unitMapping[key]}` : value;

        return (
          <li key={key}>
            {displayKey}: {displayValue}
          </li>
        );
      }
      return null;
    })}
</ul>

        <div className="flex items-center gap-2 justify-center">
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
                stroke={svgStrokeColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
              <path
                d="M12 6V12"
                stroke={svgStrokeColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
              <path
                d="M16.24 16.24L12 12"
                stroke={svgStrokeColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
            </g>
          </svg>
          <p className="lastupdate ">Last updated at {createdAt}</p>
        </div>
      </button>
    </div>
  );
};

export default Card;

import React from "react";
const Card = ({
  itemName,
  itemAttributes,
  type,
  setSelectedNode,
  activityy,
}) => {
  const cardClassName = activityy ? "activecard" : "inactivecard";
  return (
    <div className={`${cardClassName} card text-black`}>
      <button
        className="w-full"
        onClick={() => setSelectedNode({ itemName, itemAttributes, type })}
      >
        <h3 className="text-xl text-center">{itemName}</h3>
        <ul>
          {itemAttributes &&
            Object.entries(itemAttributes).map(
              ([key, value]) =>
                key !== "created_at" &&
                key !== "nodeID" && (
                  <li key={key}>
                    {key}: {value}
                  </li>
                )
            )}
        </ul>
      </button>
    </div>
  );
};

export default Card;

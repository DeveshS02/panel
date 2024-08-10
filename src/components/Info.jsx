
import React, { useState } from "react";
import Control from "./Control";
import DisplayNodes from "./DisplayNodes";

const Info = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedActivity, setSelectedActivity] = useState("All");

  return (
    <div>
      <div className="top mt-5 h-[9.5vh] flex justify-center items-center">
        <Control
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedActivity={selectedActivity}
          setSelectedActivity={setSelectedActivity}
        />
      </div>

      <div className="nodes mt-4 h-[80vh] overflow-scroll overflow-x-hidden">
        <DisplayNodes
          selectedType={selectedType}
          selectedActivity={selectedActivity}
        />
      </div>
    </div>
  );
};

export default Info;

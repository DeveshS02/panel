import React, { useState } from "react";
import Control from "./Control";
import DisplayNodes from "./DisplayNodes";
import Stats from "./Stats";

const Info = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedActivity, setSelectedActivity] = useState("All");

  return (
    <div className="flex flex-col">
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
          <div className="ml-4">
            <Stats />
          </div>
          <DisplayNodes
            selectedType={selectedType}
            selectedActivity={selectedActivity}
          />
        </div>
      </div>
    </div>
  );
};

export default Info;

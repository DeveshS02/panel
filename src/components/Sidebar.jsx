import React from "react";

const Sidebar = () => {
  const locations = [
    "Location 1",
    "Location 2",
    "Location 3",
    "Location 4",
    "Location 5",
  ];
  return (
    <div className="flex flex-col sidebarmenu h-[100%] rounded-2xl">
      <div className="logo">
        <img
          className=" w-3/4 mt-4 m-auto"
          src="/Images/hydrowLogo.jpg"
          alt="Logo"
        />
      </div>

      <div className="location w-full h-[90%] mt-3 flex flex-col justify-center m-auto text-2xl ">
        {locations.map((item, index) => (
          <button
            key={index}
            // style={{ backgroundColor: "#3892EE" }}
            className="text-white menuitem py-2 px-4 mx-auto my-3 rounded w-[62%]"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};
export default Sidebar;

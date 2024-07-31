import React from 'react'

const Sidebar = () => {
  const locations= ["Location 1", "Location 2", "Location 3", "Location 4", "Location 5"];
  return (
    <div className='h-[90vh]'>
        <div className="logo flex justify-center mt-5 border-2">
            <img className='w-3/4' src="/Images/hydrowLogo.jpg" alt="Logo" />
        </div>

        <div className="location w-full h-[90%] mt-3 flex flex-col justify-center m-auto text-2xl border-2">
          {locations.map((item, index) => (
            <button 
              key={index} 
              className="bg-blue-500 text-white py-2 px-4 mx-auto my-3 rounded w-[62%]"
            >
          {item}
        </button>
      ))}
        </div>
    </div>
  )
}

export default Sidebar
import React from 'react'
import Dropdown from './Dropdown';
import Profile from './Profile';

const Control = () => {
    const activity= ["Active","Inactive", "All"];
    const types= ["Borewell", "Water", "Tank", "All"];

  return (
    <div className='flex justify-around border-2 w-full items-center'>
        
        <Dropdown label="Select an option" options={activity} />
        
        <Dropdown label="Select an option" options={types} />

        <Profile />
    
    </div>
  )
}

export default Control
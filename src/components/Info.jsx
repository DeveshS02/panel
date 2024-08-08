import React from 'react'
import Control from './Control'
import DisplayNodes from './DisplayNodes'
import Activity from './Activity'

const Info = () => {
  return (
    <div>
        <div className="top border-2 mt-5 h-[10vh] flex items-center">
            <Control />
        </div>

        <div className="nodes border-2 mt-3 h-[80vh] overflow-scroll overflow-x-hidden">
            <DisplayNodes />
            {/* <Activity /> */}
        </div>
    </div>
  )
}

export default Info
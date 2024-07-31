import Sidebar from './components/Sidebar'
import Info from './components/Info'
import './index.css'
function App() {

  return (
    <>
      <div className='bg-main h-[100vh] w-[100vw] flex'>
        
        <div className='sidebar bg-sidebar w-[20%]'> 
          <Sidebar /> 
        </div>

        <div className='info w-[80%] bg-main'>
          <Info />
        </div>
      </div>
    </>
  )
}

export default App

import Sidebar from './components/Sidebar'
import Info from './components/Info'
import './index.css'
function App() {

  return (
    <>
      <div className='bg-main h-[100vh] w-[100vw] flex'>
        <div className='w-[23%] flex justify-center content-center flex-wrap'>
          <div className='h-[94%] w-[86%]'>
          <Sidebar />
          </div>
        </div>
        <div className='info w-[100%] bg-main'>
          <Info />
        </div>
      </div>
    </>
  )
}

export default App

import React from 'react'
import LeftNav from './applicationUserComponents/LeftNav'
import TopNav from './applicationUserComponents/TopNav'
import RegisterDonor from './applicationUserPages/RegisterDonor'
import Footer from './applicationUserComponents/Footer'

const DashboardRegisterDonor = () => {
  return (
    <div className="flex h-screen">
      
      <div className="w-1/5 h-screen bg-white fixed">
        <LeftNav />
      </div>

      
      <div className="w-4/5 ml-1/5 flex flex-col overflow-y-auto" style={{ marginLeft: '20%' }}>
        <TopNav />
        <div className=" flex-1 overflow-auto">
          <RegisterDonor />
          <Footer/>
        </div>
      </div>
    </div>
  )
}

export default DashboardRegisterDonor
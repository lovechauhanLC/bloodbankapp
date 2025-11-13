import React from 'react'
import LeftNav from './applicationUserComponents/LeftNav'
import TopNav from './applicationUserComponents/TopNav'
import BloodInventory from './applicationUserPages/BloodInventory'
import BloodBank from './applicationUserPages/BloodBank'

const DashboardBloodInventory = () => {
  return (
     <div className='flex'>
      <div className='w-1/5'>
        <LeftNav/>
      </div>
      <div className='w-4/5 flex flex-col'>
        <TopNav/>
        <div className=''>
          <BloodInventory/>
        </div>
      </div>
    </div>
  )
  
}

export default DashboardBloodInventory
import React from 'react'
import LeftNav from './applicationUserComponents/LeftNav'
import TopNav from './applicationUserComponents/TopNav'
import DonationRequestsApproval from './applicationUserPages/DonationRequestsApproval'
import BloodBank from './applicationUserPages/BloodBank'

const DashboardRequestsApproval = () => {
  return (
     <div className='flex'>
      <div className='w-1/5'>
        <LeftNav/>
      </div>
      <div className='w-4/5 flex flex-col'>
        <TopNav/>
        <div className=''>
          <DonationRequestsApproval/>
        </div>
      </div>
    </div>
  )
  
}

export default DashboardRequestsApproval
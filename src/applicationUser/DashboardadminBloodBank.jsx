import React from 'react'
import LeftNav from './applicationUserComponents/LeftNav'
import TopNav from './applicationUserComponents/TopNav'
import AdminBloodBank from './applicationUserPages/adminBloodBank'

const DashboardadminBloodBank = () => {
  return (
    <div className='flex'>
      <div className='w-1/5'>
        <LeftNav/>
      </div>
      <div className='w-4/5 flex flex-col'>
        <TopNav/>
        <div className=''>
          <AdminBloodBank/>
        </div>
      </div>
    </div>
  )
}

export default DashboardadminBloodBank
import React, { useEffect } from 'react'
import LeftNav from './applicationUserComponents/LeftNav'
import TopNav from './applicationUserComponents/TopNav'
import DonorsListing from './applicationUserPages/DonorsListing'
import BloodBank from './applicationUserPages/BloodBank'



const DonarList = () => {
  return (
     <div className='flex'>
      <div className='w-1/5'>
        <LeftNav/>
      </div>
      <div className='w-4/5 flex flex-col'>
        <TopNav/>
        <div className=''>
        <DonorsListing />
        </div>
      </div>
    </div>
  )
  
}

export default DonarList
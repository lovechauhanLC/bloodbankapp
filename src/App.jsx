import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./auth/Login"
import Register from "./auth/register"
import DashboardBloodBank from "./applicationUser/DashboardBloodBank"
import DashboardDonationRequest from "./applicationUser/DashboardDonationRequest"
import DashboardRegisterDonor from "./applicationUser/DashboardRegisterDonor"
import DashboardSearchDonor from "./applicationUser/DashboardSearchDonor"
import DashboardDonationListing from "./applicationUser/DashboardDonationListing"
import DashboardBloodInventory from "./applicationUser/DashboardBloodInventory"
import DashboardRequestsApproval from "./applicationUser/DashboardRequestsApproval"
import DashboardadminBloodBank from "./applicationUser/DashboardadminBloodBank"
import DashboardadminDonors from "./applicationUser/DashboardadminDonors"
import DashboardadminDonationRequests from "./applicationUser/DashboardadminDonationRequests"

import { Navigate } from "react-router-dom"
// import DonorsListing from "./applicationUser/applicationUserPages/DonorsListing"
// import DonationRequest from "./applicationUser/applicationUserPages/DonationRequest"
// import DonationRequestsApproval from "./applicationUser/applicationUserPages/DonationRequestsApproval"



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/bloodBanks" element={<DashboardBloodBank/>} />
        <Route path="/donationRequest" element={<DashboardDonationRequest/>} />
        <Route path="/registerDonor" element={<DashboardRegisterDonor/>} />
        <Route path="/searchDonor" element={<DashboardSearchDonor/>} />
        <Route path="/donorList" element={<DashboardDonationListing/>} />
        <Route path="/bloodInventory" element={<DashboardBloodInventory/>} />
        <Route path="/requestApproval" element={<DashboardRequestsApproval/>} />
        <Route path="/admin/bloodBanks" element={<DashboardadminBloodBank/>} />
        <Route path="/admin/donors" element={<DashboardadminDonors/>} />
        <Route path="/admin/donationRequests" element={<DashboardadminDonationRequests/>} />
      </Routes>
      
    </Router>
  )
}

export default App
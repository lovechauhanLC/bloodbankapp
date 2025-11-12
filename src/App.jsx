import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./auth/Login"
import Register from "./auth/register"
import DashboardBloodBank from "./applicationUser/DashboardBloodBank"
import DashboardDonationRequest from "./applicationUser/DashboardDonationRequest"
import DashboardRegisterDonor from "./applicationUser/DashboardRegisterDonor"
import DashboardSearchDonor from "./applicationUser/DashboardSearchDonor"
import { Navigate } from "react-router-dom"



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
      </Routes>
      
    </Router>
  )
}

export default App
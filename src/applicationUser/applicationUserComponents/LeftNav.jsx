import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LeftNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState("1");

  useEffect(() => {
    const storedRole = sessionStorage.getItem("user");
    const cleanedRole = storedRole ? storedRole.replace(/^"|"$/g, "") : "1";
    setRole(cleanedRole);
  }, []);

  console.log(role)
  const handleNavigate = (path) => {
    console.log("entered");
    
    navigate(path)
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-[#e73e32] text-white"
      : "text-black hover:bg-[#e73e32] hover:text-white";

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 px-5 pt-6">
          <div className="h-8 w-8 rounded-full bg-[#e73e32]"></div>
          <div className="text-3xl font-medium">LOGO</div>
        </div>

        <div className="flex flex-col gap-2 mt-10 px-5">

          {/* APPLICATION USER (role = 1) */}
          {role === "1" && (
            <div>
              <button
                onClick={() => handleNavigate("/bloodBanks")}
                className={`text-left h-[50px] rounded px-4 transition ${isActive("/bloodBanks")}`}
              >
                Blood Banks
              </button>

              <button
                onClick={() => handleNavigate("/searchDonor")}
                className={`text-left h-[50px] rounded px-4 transition ${isActive("/searchDonor")}`}
              >
                Search Donors
              </button>

              <button
                onClick={() => handleNavigate("/donationRequest")}
                className={`text-left h-[50px] rounded px-4 transition ${isActive("/donationRequest")}`}
              >
                Donation Requests
              </button>

              <button
                onClick={() => handleNavigate("/registerDonor")}
                className={`text-left h-[50px] rounded px-4 transition ${isActive("/registerDonor")}`}
              >
                Register as Donor
              </button>
            </div>
          )}

          
          {role === "2" && (
            <>
              <button
                onClick={() => handleNavigate("/donorList")}
                className={`text-left h-[50px] rounded px-4 transition ${isActive("/donorList")}`}
              >
                Donors
              </button>

              <button
                onClick={() => handleNavigate("/requestApproval")}
                className={`text-left h-[50px] rounded px-4 transition ${isActive("/donationRequest")}`}
              >
                Donation Requests
              </button>

              <button
                onClick={() => handleNavigate("/bloodInventory")}
                className={`text-left h-[50px] rounded px-4 transition ${isActive("/bloodInventory")}`}
              >
                Blood Inventory
              </button>
            </>
          )}

          {/* SYSTEM ADMIN (role = 0) */}
          {role === "0" && (
            <>
              <button
                onClick={() => handleNavigate("/admin/bloodBanks")}
                className={`text-left h-[50px] rounded px-4 transition ${isActive("/admin/bloodBanks")}`}
              >
                Blood Banks
              </button>

              <button
                onClick={() => handleNavigate("/admin/donors")}
                className={`text-left h-[50px] rounded px-4 transition ${isActive("/admin/donors")}`}
              >
                Donors
              </button>

              <button
                onClick={() => handleNavigate("/admin/donationRequests")}
                className={`text-left h-[50px] rounded px-4 transition ${isActive("/admin/donationRequests")}`}
              >
                Donation Requests
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5 mb-8">
        <button
          onClick={handleLogout}
          className="h-10 border-2 border-[#e73e32] rounded text-[#e73e32] font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default LeftNav;

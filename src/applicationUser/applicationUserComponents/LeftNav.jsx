import React from "react";
import { useNavigate } from "react-router-dom";

const LeftNav = () => {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");
  const isBloodBankUser = role === "Blood Bank User" || role === "Admin";

  const handleNavigate = (path) => navigate(path);

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
          {isBloodBankUser ? (
            <>
              <button
                onClick={() => handleNavigate("/donors")}
                className="text-left hover:bg-[#e73e32] hover:text-white transition duration-300 h-[50px] rounded px-4"
              >
                Donors
              </button>
              <button
                onClick={() => handleNavigate("/donationRequest")}
                className="text-left hover:bg-[#e73e32] hover:text-white transition duration-300 h-[50px] rounded px-4"
              >
                Donation Requests
              </button>
              <button
                onClick={() => handleNavigate("/bloodInventory")}
                className="text-left hover:bg-[#e73e32] hover:text-white transition duration-300 h-[50px] rounded px-4"
              >
                Blood Inventory
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigate("/bloodBanks")}
                className="text-left hover:bg-[#e73e32] hover:text-white transition duration-300 h-[50px] rounded px-4"
              >
                Blood Banks
              </button>
              <button
                onClick={() => handleNavigate("/searchDonor")}
                className="text-left hover:bg-[#e73e32] hover:text-white transition duration-300 h-[50px] rounded px-4"
              >
                Search Donors
              </button>
              <button
                onClick={() => handleNavigate("/donationRequest")}
                className="text-left hover:bg-[#e73e32] hover:text-white transition duration-300 h-[50px] rounded px-4"
              >
                Donation Requests
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5 mb-8">
        {!isBloodBankUser && (
          <button
            onClick={() => handleNavigate("/registerDonor")}
            className="h-10 bg-[#e73e32] rounded text-white font-medium"
          >
            Register as Donor
          </button>
        )}
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

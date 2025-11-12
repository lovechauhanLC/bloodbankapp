import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE;

const BloodBank = () => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });
  const [filters, setFilters] = useState({ state: "", city: "" });

  const states = ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu"];
  const citiesByState = {
    Delhi: ["New Delhi", "Dwarka", "Rohini"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Karnataka: ["Bengaluru", "Mysuru", "Hubli"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  };

  const fetchBloodBanks = async () => {
    setLoading(true);
    setError("");

    try {
      let token = sessionStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      token = token.replace(/^"|"$/g, "").trim();

      const { data } = await axios.get(`${BASE_URL}/bloodBanks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit: 10,
          page,
          state: filters.state || undefined,
          city: filters.city || undefined,
        },
      });

      const banks = Array.isArray(data?.response) ? data.response : [];

      if (banks.length === 0) {
        setError("No blood banks found.");
        setBloodBanks([]);
        return;
      }

      setBloodBanks(banks);
      setPagination({
        totalPages: data?.pagination?.totalPages || 1,
        currentPage: data?.pagination?.currentPage || 1,
      });
    } catch (err) {
      console.error("Error fetching blood banks:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized access. Please log in again.");
      } else {
        setError("Failed to load blood banks. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDonationRequest = async (bloodBankId) => {
    try {
      let token = sessionStorage.getItem("token");
      if (!token) {
        alert("Please log in again.");
        return;
      }

      token = token.replace(/^"|"$/g, "").trim();

      const payload = { blood_bank_id: bloodBankId };

      await axios.post(`${BASE_URL}/raiseBloodBankDonationRequest`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Donation request sent successfully.");
    } catch (err) {
      console.error("Error sending donation request:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        sessionStorage.clear();
        window.location.href = "/login";
      } else {
        alert("Failed to send donation request. Please try again later.");
      }
    }
  };

  useEffect(() => {
    fetchBloodBanks();
  }, [page, filters.state, filters.city]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { city: "" } : {}),
    }));
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-8 flex flex-col min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Blood Banks</h1>

        <div className="flex space-x-6">
          <div>
            <label htmlFor="state" className="block mb-1 font-semibold text-gray-700">
              State
            </label>
            <select
              id="state"
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-3 py-2 w-40"
            >
              <option value="">All States</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="city" className="block mb-1 font-semibold text-gray-700">
              City
            </label>
            <select
              id="city"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-3 py-2 w-40"
              disabled={!filters.state}
            >
              <option value="">All Cities</option>
              {filters.state &&
                citiesByState[filters.state].map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-auto grow bg-white rounded-md shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex justify-center py-10 text-gray-600">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">{error}</div>
        ) : (
          <table className="min-w-full border border-gray-300">
            <thead className="bg-red-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Blood Bank Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">City</th>
                <th className="border border-gray-300 px-4 py-2 text-left">State</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Contact Number</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Address</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {bloodBanks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border border-gray-300 px-4 py-6 text-center text-gray-500">
                    No blood banks found.
                  </td>
                </tr>
              ) : (
                bloodBanks.map((bank, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-all">
                    <td className="border border-gray-300 px-4 py-2">{bank.bankName || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{bank.city || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{bank.state || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{bank.phone || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{bank.address || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => handleDonationRequest(bank.blood_bank_id || bank.id)}
                        className="text-red-600 hover:text-red-800 transition-all duration-200"
                      >
                        <FaPaperPlane size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {!loading && !error && (
        <div className="mt-6 flex justify-center space-x-2">
          <button
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || loading}
          >
            &lt;
          </button>
          {[...Array(pagination.totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                className={`px-3 py-1 border border-gray-300 rounded ${
                  pageNum === page ? "bg-red-600 text-white" : "hover:bg-gray-200"
                }`}
                onClick={() => handlePageChange(pageNum)}
                disabled={loading}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pagination.totalPages || loading}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default BloodBank;

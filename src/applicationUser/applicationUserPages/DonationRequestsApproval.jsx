import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE;

const DonationRequestsApproval = () => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  let token = sessionStorage.getItem("token");
  token = token ? token.replace(/^"|"$/g, "").trim() : "";

  const fetchRequests = async () => {
    try {

      const res = await axios.get(`${BASE_URL}/donationRequests?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data.response[0]);
      

      setRequests(res.data.response || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching donation requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page]);

  return (
    <div className="p-6">
      <h1 className="text-[28px] font-semibold mb-5">Donation Requests</h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#EEF2FF]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Full Name</th>
              <th className="px-4 py-3 text-left font-semibold">Blood Group</th>
              <th className="px-4 py-3 text-left font-semibold">Mobile</th>
              <th className="px-4 py-3 text-left">City</th>
              <th className="px-4 py-3 text-left">Medical Condition</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.requestId} className="border-b hover:bg-gray-50">
                <td
                  className="px-4 py-3 text-blue-600 underline cursor-pointer"
                  onClick={() => navigate(`/donation-requests/${req.requestId}`)}
                >
                  {req.fullName}
                </td>
                <td className="px-4 py-3">{req.bloodGroup}</td>
                <td className="px-4 py-3">{req.mobile}</td>
                <td className="px-4 py-3">{req.city}</td>
                <td className="px-4 py-3">{req.medicalCondition}</td>
                <td className="px-4 py-3 capitalize">{req.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          ⟨
        </button>

        <span className="px-4 py-2 bg-green-600 text-white rounded">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          ⟩
        </button>
      </div>

      <div className="flex justify-between text-sm mt-10 text-gray-600">
        <p>2023 Developed and Maintained by Velocity.</p>
        <p>Technical Support by Velocity.</p>
      </div>
    </div>
  );
};

export default DonationRequestsApproval;
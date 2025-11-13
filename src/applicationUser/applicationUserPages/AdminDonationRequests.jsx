import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;

const AdminDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  let token = sessionStorage.getItem("token");
  token = token ? token.replace(/^"|"$/g, "").trim() : "";

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/donationRequests?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRequests(res.data.response || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Fetch Donation Requests Error:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page]);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-[28px] font-semibold">Donation Requests</h1>

        <button className="bg-green-600 text-white px-6 py-2 rounded">
          Export
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#EEF2FF]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Contact Number</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">State</th>
              <th className="px-4 py-3 text-left font-semibold">City</th>
              <th className="px-4 py-3 text-left font-semibold">Blood Group</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((r) => (
              <tr key={r.requestId} className="border-b">
                <td className="px-4 py-3">{r.fullName}</td>
                <td className="px-4 py-3">{r.mobile}</td>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3">{r.state}</td>
                <td className="px-4 py-3">{r.city}</td>
                <td className="px-4 py-3">{r.bloodGroup}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex gap-3 justify-center mt-6">
        <button
          onClick={() => page > 1 && setPage(page - 1)}
          className="px-3 py-1 border rounded"
        >
          «
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-green-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => page < totalPages && setPage(page + 1)}
          className="px-3 py-1 border rounded"
        >
          »
        </button>
      </div>

      <div className="flex justify-between text-sm mt-10 text-gray-600">
        <p>2023 Developed and Maintained by Velocity.</p>
        <p>Technical Support by Velocity.</p>
      </div>
    </div>
  );
};

export default AdminDonationRequests;
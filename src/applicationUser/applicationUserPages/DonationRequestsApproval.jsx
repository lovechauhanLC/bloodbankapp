import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE;

const DonationRequestsApproval = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/donationRequests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests();
    } catch (err) {
      console.error("Error deleting donation request", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(
        `${BASE_URL}/donationRequests/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/donation-requests/${id}`);
    } catch (err) {
      console.error("Error approving request", err);
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
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Contact Number</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">State</th>
              <th className="px-4 py-3 text-left font-semibold">City</th>
              <th className="px-4 py-3 text-left font-semibold">Blood Group</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr
                key={req.requestId}
                className={
                  req.status === "rejected"
                    ? "border-b bg-gray-100 opacity-40 cursor-not-allowed"
                    : "border-b hover:bg-gray-50"
                }
              >
                <td className="px-4 py-3 text-blue-600 underline cursor-pointer">
                  {req.fullName}
                </td>

                <td className="px-4 py-3">{req.mobile}</td>
                <td className="px-4 py-3">{req.email}</td>
                <td className="px-4 py-3">{req.state}</td>
                <td className="px-4 py-3">{req.city}</td>

                <td className="px-4 py-3 font-semibold text-red-600">
                  {req.bloodGroup}
                </td>

                <td
                  className="px-4 py-3 flex gap-4 cursor-pointer"
                  onClick={() => {
                    if (req.status === "pending") {
                      setSelectedRequest(req);
                      setShowPopup(true);
                    }
                  }}
                >
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(req.requestId);
                    }}
                    className="text-red-600 hover:text-red-800 text-xl"
                  >
                    🗑
                  </button>

                  {/* Approve Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (req.status === "pending") handleApprove(req.requestId);
                    }}
                    className={
                      req.status === "approved"
                        ? "text-green-400 opacity-40 cursor-not-allowed text-xl"
                        : "text-green-600 hover:text-green-800 text-xl"
                    }
                    disabled={req.status === "approved"}
                  >
                    ✔
                  </button>
                </td>
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

      {showPopup && selectedRequest && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-white/10">
          <div className="bg-white p-8 rounded-xl shadow-lg w-[70%] max-w-3xl">
            <h2 className="text-2xl font-semibold mb-6">New Donation Request</h2>

            <div className="grid grid-cols-2 gap-y-6">
              <p><strong>Full Name:</strong></p>
              <p>{selectedRequest.fullName}</p>

              <p><strong>Contact Number:</strong></p>
              <p>{selectedRequest.mobile}</p>

              <p><strong>Email:</strong></p>
              <p>{selectedRequest.email}</p>

              <p><strong>Blood Group:</strong></p>
              <p>{selectedRequest.bloodGroup}</p>

              <p><strong>Medical Condition Description:</strong></p>
              <p>{selectedRequest.medicalCondition}</p>
            </div>

            <div className="flex justify-center gap-6 mt-10">
              <button
                className="px-6 py-2 bg-green-600 text-white rounded-lg"
                onClick={async () => {
                  try {
                    await axios.put(
                      `${BASE_URL}/updateDonationRequestStatus/${selectedRequest.requestId}`,
                      `status=approved`,
                      {
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded",
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    setShowPopup(false);
                    fetchRequests();
                  } catch (err) {
                    console.error("Error approving request", err);
                  }
                }}
              >
                Accept
              </button>

              <button
                className="px-6 py-2 bg-red-600 text-white rounded-lg"
                onClick={async () => {
                  try {
                    await axios.put(
                      `${BASE_URL}/updateDonationRequestStatus/${selectedRequest.requestId}`,
                      `status=rejected`,
                      {
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded",
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    setShowPopup(false);
                    fetchRequests();
                  } catch (err) {
                    console.error("Error rejecting request", err);
                  }
                }}
              >
                Discard
              </button>
            </div>

            <button
              className="absolute top-4 right-4 text-xl"
              onClick={() => setShowPopup(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationRequestsApproval;
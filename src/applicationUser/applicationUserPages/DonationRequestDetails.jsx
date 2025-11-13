import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;

const DonationRequestDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);

  let token = sessionStorage.getItem("token");
  token = token ? token.replace(/^"|"$/g, "").trim() : "";

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/donationRequests?requestId=${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDetails(res.data.response[0]);
    } catch (error) {
      console.error("Error loading details:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleApprove = async () => {
    try {
      await axios.put(
        `${BASE_URL}/updateDonationRequestStatus`,
        { requestId, status: "approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/donation-requests");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to discard?")) return;

    try {
      await axios.delete(`${BASE_URL}/deleteDonationRequest`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { requestId },
      });
      navigate("/donation-requests");
    } catch (err) {
      console.error(err);
    }
  };

  if (!details) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-[28px] font-semibold mb-6">New Donation Request</h1>

      <div className="bg-white shadow-md p-8 rounded-lg max-w-4xl">
        <div className="grid grid-cols-2 gap-y-6">
          <p><strong>Full Name:</strong></p>
          <p>{details.fullName}</p>

          <p><strong>Contact Number:</strong></p>
          <p>{details.mobile}</p>

          <p><strong>Email:</strong></p>
          <p>{details.email}</p>

          <p><strong>Blood Group:</strong></p>
          <p>{details.bloodGroup}</p>

          <p><strong>Medical Condition Description:</strong></p>
          <p>{details.medicalCondition}</p>
        </div>

        <div className="flex gap-6 mt-10">
          <button
            onClick={handleApprove}
            className="bg-green-600 text-white px-10 py-2 rounded"
          >
            Accept
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-10 py-2 rounded"
          >
            Discard
          </button>
        </div>
      </div>

      <div className="flex justify-between text-sm mt-10 text-gray-600">
        <p>2023 Developed and Maintained by Velocity.</p>
        <p>Technical Support by Velocity.</p>
      </div>
    </div>
  );
};

export default DonationRequestDetails;
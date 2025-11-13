

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE;

const DonationRequestDetailsApproval = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // clean token
  let token = sessionStorage.getItem("token");
  if (token) {
    try {
      token = JSON.parse(token);
    } catch (e) {
      token = token.trim();
    }
  }

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/donationRequests`, {
        headers: { Authorization: token },
      });

      const all = res.data.response || [];

      const found = all.find(
        (item) =>
          item.requestId == id ||
          item.request_id == id ||
          item.id == id
      );

      setDetails(found);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching details", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) {
    return <div className="p-8 text-xl font-semibold">Loading...</div>;
  }

  if (!details) {
    return (
      <div className="p-8 text-red-600 text-lg">
        Request not found.
        <button
          onClick={() => navigate(-1)}
          className="ml-4 underline text-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-[28px] font-bold mb-10">Donation Request Details</h1>

      <div className="bg-white shadow-lg rounded-xl p-10 max-w-5xl mx-auto">

        <div className="grid grid-cols-2 gap-y-8 text-[17px]">

          <p className="font-semibold text-gray-700">Full Name:</p>
          <p>{details.fullName}</p>

          <p className="font-semibold text-gray-700">Contact Number:</p>
          <p>{details.mobile}</p>

          <p className="font-semibold text-gray-700">Email:</p>
          <p>{details.email}</p>

          <p className="font-semibold text-gray-700">Blood Group:</p>
          <p>{details.bloodGroup}</p>

          <p className="font-semibold text-gray-700">Medical Condition Description:</p>
          <p>{details.medicalCondition}</p>

        </div>

        <div className="flex justify-center gap-10 mt-14">
          <button
            onClick={() => navigate(-1)}
            className="px-10 py-3 bg-gray-600 text-white text-lg rounded-md hover:bg-gray-700 transition"
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
};

export default DonationRequestDetailsApproval;
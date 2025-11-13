import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaCheckCircle } from "react-icons/fa";
import LeftNav from "../applicationUserComponents/LeftNav"
import TopNav from "../applicationUserComponents/TopNav"

const BASE_URL = import.meta.env.VITE_API_BASE;

const DonationRequest = () => {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    state: "",
    city: "",
    bloodGroup: "",
    medicalCondition: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const role = sessionStorage.getItem("role");
  let token = sessionStorage.getItem("token");
  token = token ? token.replace(/^"|"$/g, "").trim() : "";

  const fetchRequests = async () => {
    if (role !== "Blood Bank User" && role !== "Admin") return;

    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/donationRequests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = data?.response || data?.data || [];
      setRequests(Array.isArray(list) ? list : []);
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage("Session expired. Please log in again.");
        sessionStorage.clear();
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        setMessage("Failed to load donation requests.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      await axios.put(
        `${BASE_URL}/updateDonationRequestStatus`,
        { request_id: requestId, status: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (err) {
      setMessage("Failed to approve request.");
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      await axios.delete(`${BASE_URL}/deleteDonationRequest/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests();
    } catch {
      setMessage("Failed to delete request.");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (!token) {
        setMessage("No token found. Please login again.");
        setLoading(false);
        return;
      }

      for (let key in form) {
        if (!form[key]) {
          setMessage("Please fill all fields.");
          setLoading(false);
          return;
        }
      }

      const payload = {
        full_name: form.fullName,
        mobile: form.mobile,
        email: form.email,
        state: form.state,
        city: form.city,
        blood_group: form.bloodGroup,
        medical_condition: form.medicalCondition,
      };

      const { data } = await axios.post(`${BASE_URL}/donationRequest`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.error?.response === "fail") {
        setMessage("Failed to submit donation request.");
      } else {
        setMessage("Donation request submitted successfully!");
        setForm({
          fullName: "",
          mobile: "",
          email: "",
          state: "",
          city: "",
          bloodGroup: "",
          medicalCondition: "",
        });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage("Session expired. Please log in again.");
        sessionStorage.clear();
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        setMessage("Operation failed. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (role === "Admin" || role === "Blood Bank User") {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Donation Requests</h1>

        {loading ? (
          <div className="flex justify-center py-10 text-gray-600">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : requests.length > 0 ? (
          <div className="bg-white rounded shadow overflow-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-red-100">
                <tr>
                  <th className="p-3 border">Full Name</th>
                  <th className="p-3 border">Blood Group</th>
                  <th className="p-3 border">State</th>
                  <th className="p-3 border">City</th>
                  <th className="p-3 border">Mobile</th>
                  <th className="p-3 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.request_id || req.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{req.full_name || "N/A"}</td>
                    <td className="p-3 border">{req.blood_group || "N/A"}</td>
                    <td className="p-3 border">{req.state || "N/A"}</td>
                    <td className="p-3 border">{req.city || "N/A"}</td>
                    <td className="p-3 border">{req.mobile || "N/A"}</td>
                    <td className="p-3 border text-center space-x-3">
                      <button
                        onClick={() => handleApprove(req.request_id || req.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaCheckCircle />
                      </button>
                      <button
                        onClick={() => handleDelete(req.request_id || req.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-8">
            No donation requests found.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center bg-gray-50">
    <LeftNav/>
      <div className="bg-white rounded-lg p-8 w-full max-w-5xl mx-auto shadow-md">
      <TopNav/>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Submit Donation Request
        </h2>

        <form
          className="space-y-6 border border-slate-300 p-6 px-12 rounded-lg"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: "fullName", label: "Full Name", type: "text" },
              { id: "mobile", label: "Mobile Number", type: "text" },
              { id: "email", label: "Email", type: "email" },
            ].map((input) => (
              <div key={input.id} className="flex flex-col">
                <label htmlFor={input.id} className="mb-2 text-gray-700 font-medium">
                  {input.label}
                </label>
                <input
                  id={input.id}
                  type={input.type}
                  value={form[input.id]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder={`Enter your ${input.label.toLowerCase()}`}
                  required
                />
              </div>
            ))}

            <div className="flex flex-col">
              <label htmlFor="state" className="mb-2 text-gray-700 font-medium">
                State
              </label>
              <input
                id="state"
                type="text"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter your state"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="city" className="mb-2 text-gray-700 font-medium">
                City
              </label>
              <input
                id="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter your city"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="bloodGroup" className="mb-2 text-gray-700 font-medium">
                Blood Group
              </label>
              <select
                id="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              >
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="medicalCondition"
              className="mb-2 text-gray-700 font-medium"
            >
              Medical Condition Description
            </label>
            <textarea
              id="medicalCondition"
              rows={4}
              value={form.medicalCondition}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
              placeholder="Describe your medical condition"
              required
            ></textarea>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-2 rounded-md shadow transition duration-200 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>

          {message && (
            <p
              className={`text-center mt-4 text-sm ${
                message.includes("successfully") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default DonationRequest;
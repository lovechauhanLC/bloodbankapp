import React, { useState } from "react";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE ||
  "https://blood-bank.veldev.com/Laravel-Blood-Bank/public/api";

const SearchDonor = () => {
  const [form, setForm] = useState({
    state: "",
    city: "",
    district: "",
    bloodGroup: "",
  });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const role = sessionStorage.getItem("role");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setDonors([]);
    setLoading(true);

    try {
      let token = sessionStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      token = token.replace(/^"|"$/g, "").trim();

      const params = {
        state: form.state,
        city: form.city,
        district: form.district,
        blood_group: form.bloodGroup,
        limit: 10,
        page: 1,
      };

      const response = await axios.get(`${BASE_URL}/searchDonars`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      let donorList = [];

      if (Array.isArray(response.data?.response)) {
        donorList = response.data.response;
      } else if (Array.isArray(response.data)) {
        donorList = response.data;
      } else if (response.data?.response && typeof response.data.response === "object") {
        donorList = Object.values(response.data.response);
      }

      if (donorList.length === 0) {
        setError("No donors found for the given criteria.");
      } else {
        setDonors(donorList);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Unauthorized access. Please login again.");
        sessionStorage.removeItem("token");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (role === "Admin" || role === "Blood Bank User") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-700">
          You do not have access to Search Donors.
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8">
      <div className="bg-white rounded-lg p-8 w-full max-w-5xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Donors</h2>

        <form
          className="space-y-6 border border-slate-200 rounded-md p-6"
          onSubmit={handleSubmit}
        >
          <h3 className="text-lg font-semibold">Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["state", "city", "district"].map((field) => (
              <div key={field}>
                <label className="block mb-2 text-gray-700 font-medium capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring focus:ring-blue-300"
                  required
                />
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold">Blood Group Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring focus:ring-blue-300"
                required
              >
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-2 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Searching..." : "Submit"}
            </button>
          </div>
        </form>

        {loading && (
          <div className="flex justify-center mt-6">
            <div className="w-10 h-10 border-4 border-t-transparent border-red-500 rounded-full animate-spin"></div>
          </div>
        )}

        {error && !loading && (
          <p className="text-center text-red-600 mt-4">{error}</p>
        )}

        {!loading && donors.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-red-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Blood Group</th>
                  <th className="border px-4 py-2 text-left">City</th>
                  <th className="border px-4 py-2 text-left">State</th>
                  <th className="border px-4 py-2 text-left">Mobile</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((donor, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">
                      {donor.fullName || donor.full_name}
                    </td>
                    <td className="border px-4 py-2">
                      {donor.bloodGroup || donor.blood_group}
                    </td>
                    <td className="border px-4 py-2">{donor.city}</td>
                    <td className="border px-4 py-2">{donor.state}</td>
                    <td className="border px-4 py-2">{donor.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDonor;
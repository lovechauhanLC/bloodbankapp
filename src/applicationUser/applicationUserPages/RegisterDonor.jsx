import React, { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;

const RegisterDonor = () => {
  const role = sessionStorage.getItem("role");
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    contact: "",
    email: "",
    state: "",
    district: "",
    city: "",
    lastDate: "",
    preference: "",
    donatedPreviously: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value, name } = e.target;
    const key = id || name;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      let token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("id");

      if (!token) {
        setMessage("No token found. Please login again.");
        setLoading(false);
        return;
      }

      token = token.replace(/^"|"$/g, "").trim();
      const intUserId = parseInt(userId.replaceAll('"', ""));

      const genderMap = { Male: 1, Female: 2, Others: 3 };
      const donatedValue = form.donatedPreviously === "1" ? 1 : 2;

      const params = new URLSearchParams();
      params.append("user_id", intUserId);
      params.append("full_name", form.fullName);
      params.append("gender", genderMap[form.gender] || 1);
      params.append("dob", form.dob);
      params.append("blood_group", form.bloodGroup);
      params.append("mobile", form.contact);
      params.append("email", form.email);
      params.append("state", form.state);
      params.append("district", form.district);
      params.append("city", form.city);
      params.append("donation_date", form.lastDate);
      params.append("preference", form.preference);
      params.append("donated_previously", donatedValue);
      params.append("agree_to_contact", 1);

      const { data } = await axios.post(`${BASE_URL}/registerDonar`, params, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (data?.response?.response === "success") {
        setMessage("Donor registered successfully!");
      } else {
        setMessage("Failed to register donor. Please try again.");
      }
    } catch (err) {
      console.error("Error registering donor:", err);
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (role === "Admin" || role === "Blood Bank User") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-700">
          You do not have access to Register Donor.
        </h2>
      </div>
    );
  }

  return (
    <div className="mx-8 my-8">
      <div className="py-2">
        <h1 className="text-2xl font-semibold">Register as a Donor</h1>
      </div>
      <div className="border rounded-lg mt-2 bg-white shadow-md">
        <form className="px-20 py-8" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <h1 className="font-semibold">Personal Details</h1>
            <div className="flex gap-8">
              <div className="flex flex-col w-3/5 gap-1">
                <label htmlFor="fullName" className="text-sm font-semibold">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="border rounded-sm text-sm px-2 py-1 h-8"
                  required
                />
              </div>

              <div className="flex flex-col w-2/5 gap-1">
                <label htmlFor="gender" className="text-sm font-semibold">
                  Gender
                </label>
                <select
                  id="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="border rounded-sm px-2 py-1 h-8"
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="flex flex-col w-1/2 gap-1">
                <label htmlFor="dob" className="text-sm font-semibold">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  className="border px-2 py-1 h-8 rounded-sm text-sm"
                  required
                />
              </div>
              <div className="flex flex-col w-1/2 gap-1">
                <label htmlFor="bloodGroup" className="text-sm font-semibold">
                  Blood Group
                </label>
                <select
                  id="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className="border px-2 py-1 h-8 rounded-sm"
                  required
                >
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                    (bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-5">
            <h1 className="font-semibold">Contact Details</h1>
            <div className="flex gap-8">
              <div className="flex flex-col gap-1 w-1/2">
                <label htmlFor="contact" className="text-sm font-semibold">
                  Mobile Number
                </label>
                <input
                  id="contact"
                  type="text"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className="border px-2 py-1 h-8 rounded-sm text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-1 w-1/2">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="border px-2 py-1 h-8 rounded-sm text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-5">
            <h1 className="font-semibold">Address Details</h1>
            <div className="flex gap-8">
              {["state", "district", "city"].map((field) => (
                <div className="flex flex-col gap-1 w-1/3" key={field}>
                  <label
                    htmlFor={field}
                    className="text-sm font-semibold capitalize"
                  >
                    {field}
                  </label>
                  <input
                    id={field}
                    type="text"
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={field}
                    className="border px-2 py-1 h-8 rounded-sm text-sm"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-5">
            <h1 className="font-semibold">Donor Specific Information</h1>
            <div className="flex gap-8">
              <div className="flex flex-col w-1/2 gap-1">
                <label htmlFor="lastDate" className="text-sm font-semibold">
                  Last Date of Donation
                </label>
                <input
                  id="lastDate"
                  type="date"
                  value={form.lastDate}
                  onChange={handleChange}
                  className="border px-2 py-1 h-8 rounded-sm text-sm"
                />
              </div>
              <div className="flex flex-col w-1/2 gap-1">
                <label htmlFor="preference" className="text-sm font-semibold">
                  Donation Preference
                </label>
                <input
                  id="preference"
                  type="text"
                  value={form.preference}
                  onChange={handleChange}
                  placeholder="Donation Preference"
                  className="border px-2 py-1 h-8 rounded-sm text-sm"
                />
              </div>
            </div>

            <div>
              <p className="font-semibold text-sm mt-2">
                Have you donated previously?
              </p>
              <div>
                <label className="text-sm font-semibold mr-4">
                  <input
                    type="radio"
                    name="donatedPreviously"
                    value="1"
                    onChange={handleChange}
                    className="mr-1"
                  />
                  Yes
                </label>
                <label className="text-sm font-semibold">
                  <input
                    type="radio"
                    name="donatedPreviously"
                    value="0"
                    onChange={handleChange}
                    className="mr-1"
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-5">
            <input type="checkbox" id="tc" required />
            <label htmlFor="tc" className="text-sm font-medium">
              I agree to be contacted by blood banks, SBTCs, and NBTC
            </label>
          </div>

          <button
            type="submit"
            className="text-sm mt-5 h-8 w-35 bg-red-500 hover:bg-red-600 rounded-lg text-white px-4 transition duration-200"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {message && (
            <p
              className={`mt-4 text-sm ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
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

export default RegisterDonor;

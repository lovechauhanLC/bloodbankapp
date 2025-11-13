import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE;

const AdminBloodBank = () => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [bank_name, setBankName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [license_no, setLicenseNo] = useState("");
  const [bloodTypesAvailable, setBloodTypesAvailable] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  let token = sessionStorage.getItem("token");
  token = token ? token.replace(/^"|"$/g, "").trim() : "";

  const fetchBloodBanks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/bloodBanks?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBloodBanks(res.data.response || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Fetch Blood Banks Error:", err);
    }
  };

  useEffect(() => {
    fetchBloodBanks();
  }, [page]);

  const handleCheckboxChange = (value) => {
    if (bloodTypesAvailable.includes(value)) {
      setBloodTypesAvailable(bloodTypesAvailable.filter((v) => v !== value));
    } else {
      setBloodTypesAvailable([...bloodTypesAvailable, value]);
    }
  };

  const startEdit = (bb) => {
    setIsEditing(true);
    setEditId(bb.bloodBankId);

    setBankName(bb.bankName);
    setPhone(bb.phone);
    setEmail(bb.email);
    setAddress(bb.address);
    setState(bb.state);
    setDistrict(bb.district);
    setCity(bb.city);
    setType(bb.type || "");
    setLicenseNo(bb.licenseNo || "");

    if (bb.bloodTypesAvailable) {
      setBloodTypesAvailable(bb.bloodTypesAvailable.split(","));
    }

    setShowAddForm(true);
  };

  const handleAddBloodBank = async () => {
    try {
      const params = new URLSearchParams();
      params.append("bank_name", bank_name);
      params.append("phone", phone);
      params.append("email", email);
      params.append("address", address);
      params.append("state", state);
      params.append("district", district);
      params.append("city", city);
      params.append("type", type);
      params.append("license_no", license_no);

      bloodTypesAvailable.forEach((bg, index) => {
        params.append(`blood_types_available[${index}]`, bg);
      });

      await axios.post(`${BASE_URL}/addBloodBank`, params, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      setShowAddForm(false);
      fetchBloodBanks();
    } catch (err) {
      console.error("Add Blood Bank Error:", err);
    }
  };

  const handleUpdateBloodBank = async () => {
    try {
      const params = new URLSearchParams();
      params.append("bank_name", bank_name);
      params.append("phone", phone);
      params.append("email", email);
      params.append("address", address);
      params.append("state", state);
      params.append("district", district);
      params.append("city", city);
      params.append("type", type);
      params.append("license_no", license_no);

      bloodTypesAvailable.forEach((bg, index) => {
        params.append(`blood_types_available[${index}]`, bg);
      });

      await axios.post(`${BASE_URL}/updateBloodBank/${editId}`, params, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      setShowAddForm(false);
      setIsEditing(false);
      fetchBloodBanks();
    } catch (err) {
      console.error("Update Blood Bank Error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/deleteBloodBank/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBloodBanks();
    } catch (err) {
      console.error("Delete Blood Bank Error:", err);
    }
  };

  const bloodTypes = ["A+","A-","B+","B-","O+","O-","AB+","AB-","ABO"];

  return (
    <div className="p-6">
      {!showAddForm && (
        <div>
          <div className="flex justify-between mb-6">
            <h1 className="text-[28px] font-semibold">Blood Banks</h1>

            <div className="flex gap-4">
              <button className="bg-green-600 text-white px-6 py-2 rounded">
                Export
              </button>

              <button
                onClick={() => setShowAddForm(true)}
                className="bg-red-600 text-white px-6 py-2 rounded"
              >
                Add Blood Bank
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-[#EEF2FF]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Blood Bank</th>
                  <th className="px-4 py-3 text-left font-semibold">Contact Number</th>
                  <th className="px-4 py-3 text-left">City</th>
                  <th className="px-4 py-3 text-left">State</th>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {bloodBanks.map((bb) => (
                  <tr key={bb.bloodBankId} className="border-b">
                    <td className="px-4 py-3">{bb.bankName}</td>
                    <td className="px-4 py-3">{bb.phone}</td>
                    <td className="px-4 py-3">{bb.city}</td>
                    <td className="px-4 py-3">{bb.state}</td>
                    <td className="px-4 py-3">{bb.address}</td>

                    <td className="px-4 py-3 flex items-center gap-3 justify-center">
                      <button
                        onClick={() => handleDelete(bb.bloodBankId)}
                        className="text-red-600 text-xl hover:scale-110 transition"
                      >
                        🗑️
                      </button>

                      <button
                        onClick={() => startEdit(bb)}
                        className="text-black text-xl hover:scale-110 transition"
                      >
                        ✏️
                      </button>
                    </td>
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
      )}

      {showAddForm && (
        <div>
          <h1 className="text-[28px] font-semibold mb-6">Add Blood Bank</h1>

          <div className="bg-white shadow p-8 rounded-lg">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="font-medium">Name of the Blood Bank</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1"
                  value={bank_name} onChange={(e) => setBankName(e.target.value)} />
              </div>

              <div>
                <label className="font-medium">Phone Number</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1"
                  value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div>
                <label className="font-medium">Email</label>
                <input type="email" className="w-full border px-3 py-2 rounded mt-1"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <label className="font-medium">Address Line</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1"
                  value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <div>
                <label className="font-medium">State</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1"
                  value={state} onChange={(e) => setState(e.target.value)} />
              </div>

              <div>
                <label className="font-medium">District</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1"
                  value={district} onChange={(e) => setDistrict(e.target.value)} />
              </div>

              <div>
                <label className="font-medium">City</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1"
                  value={city} onChange={(e) => setCity(e.target.value)} />
              </div>

              <div>
                <label className="font-medium">Type of Blood Bank</label>
                <select className="w-full border px-3 py-2 rounded mt-1"
                  value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Select</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Hospital Based">Hospital Based</option>
                  <option value="Independent">Independent</option>
                </select>
              </div>

              <div>
                <label className="font-medium">License/Certification Number</label>
                <input type="text" className="w-full border px-3 py-2 rounded mt-1"
                  value={license_no} onChange={(e) => setLicenseNo(e.target.value)} />
              </div>
            </div>

            <div className="mt-8">
              <label className="font-medium mb-2 block">Blood Types Available</label>
              <div className="grid grid-cols-5 gap-3">
                {bloodTypes.map((bg) => (
                  <label key={bg} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={bloodTypesAvailable.includes(bg)}
                      onChange={() => handleCheckboxChange(bg)}
                    />
                    {bg}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-6 mt-10">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-8 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={isEditing ? handleUpdateBloodBank : handleAddBloodBank}
                className="px-8 py-2 bg-red-600 text-white rounded"
              >
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </div>

          <div className="flex justify-between text-sm mt-10 text-gray-600">
            <p>2023 Developed and Maintained by Velocity.</p>
            <p>Technical Support by Velocity.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBloodBank;
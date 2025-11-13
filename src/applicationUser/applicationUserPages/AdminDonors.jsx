import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;

const AdminDonors = () => {
  const [donors, setDonors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [fullName, setFullName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [mobile, setMobile] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [user_id, setUserId] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [donation_date, setDonationDate] = useState("");
  const [preference, setPreference] = useState("");
  const [donated_previously, setDonatedPreviously] = useState(0);
  const [agree_to_contact, setAgreeToContact] = useState(0);
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("");

  let token = sessionStorage.getItem("token");
  token = token ? token.replace(/^"|"$/g, "").trim() : "";

  const fetchDonors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/donarsListing?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDonors(res.data.response || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Fetch Donors Error:", err);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [page]);

  const startEdit = (d) => {
    setIsEditing(true);
    setEditId(d.donorId || d.id || d.user_id || d.userId || d.donorId);

    setUserId(d.user_id ?? d.userId ?? d.userId ?? "");
    setFullName(d.fullName ?? d.full_name ?? "");
    setGender(d.gender ?? "");
    setDob(d.dob ?? d.date_of_birth ?? "");
    setBloodGroup(d.bloodGroup ?? d.blood_group ?? "");
    setMobile(d.mobile ?? d.phone ?? "");
    setEmail && setEmail(d.email ?? d.email_address ?? "");
    setStateName(d.state ?? d.state_name ?? "");
    setDistrict && setDistrict(d.district ?? d.district_name ?? "");
    setCity(d.city ?? d.city_name ?? "");
    setAddress(d.address ?? d.address_line ?? "");
    setDonationDate(d.donation_date ?? d.lastDonationDate ?? d.donationDate ?? "");
    setPreference(d.preference ?? d.pref ?? "");
    setDonatedPreviously(d.donated_previously ?? d.donatedPreviously ?? 0);
    setAgreeToContact(d.agree_to_contact ?? d.agreeToContact ?? 0);

    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/deleteDonor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchDonors();
    } catch (err) {
      console.error("Delete Donor Error:", err);
    }
  };

  const handleUpdateDonor = async () => {
    try {
      const params = new URLSearchParams();
      params.append("user_id", user_id);
      params.append("full_name", fullName);
      params.append("gender", gender);
      params.append("dob", dob);
      params.append("blood_group", bloodGroup);
      params.append("mobile", mobile);
      params.append("email", email);
      params.append("state", stateName);
      params.append("district", district);
      params.append("city", city);
      params.append("donation_date", donation_date);
      params.append("preference", preference);
      params.append("donated_previously", String(donated_previously));
      params.append("agree_to_contact", String(agree_to_contact));

      await axios.put(`${BASE_URL}/editDonor/${editId}`, params, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      setIsEditing(false);
      fetchDonors();
    } catch (err) {
      console.error("Update Donor Error:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-[28px] font-semibold">Donors</h1>

        <button className="bg-green-600 text-white px-6 py-2 rounded">
          Export
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#EEF2FF]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Donor Name</th>
              <th className="px-4 py-3 text-left font-semibold">Blood Group</th>
              <th className="px-4 py-3 text-left font-semibold">Contact Number</th>
              <th className="px-4 py-3 text-left">State</th>
              <th className="px-4 py-3 text-left">City</th>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {donors.map((d) => (
              <tr key={d.donorId} className="border-b">
                <td className="px-4 py-3">{d.fullName}</td>
                <td className="px-4 py-3">{d.bloodGroup}</td>
                <td className="px-4 py-3">{d.mobile}</td>
                <td className="px-4 py-3">{d.state}</td>
                <td className="px-4 py-3">{d.city}</td>
                <td className="px-4 py-3">{d.address}</td>

                <td className="px-4 py-3 flex items-center gap-3 justify-center">
                  <button
                    onClick={() => handleDelete(d.donorId)}
                    className="text-red-600 text-xl hover:scale-110 transition"
                  >
                    🗑️
                  </button>

                  <button
                    onClick={() => startEdit(d)}
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

      {isEditing && (
        <div className="p-4 border rounded bg-gray-50 my-6">
          <h2 className="text-lg font-semibold mb-3">Edit Donor</h2>

          <div className="grid grid-cols-2 gap-4">
            <input className="border p-2" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" />
            <input className="border p-2" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} placeholder="Blood Group" />
            <input className="border p-2" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile" />
            <input className="border p-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />

            <input className="border p-2" value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="State" />
            <input className="border p-2" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="District" />

            <input className="border p-2" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
            <input className="border p-2" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />

            <input className="border p-2" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Gender (1/2)" />
            <input type="date" className="border p-2" value={dob} onChange={(e) => setDob(e.target.value)} placeholder="DOB" />

            <input type="date" className="border p-2" value={donation_date} onChange={(e) => setDonationDate(e.target.value)} placeholder="Donation Date" />
            <input className="border p-2" value={preference} onChange={(e) => setPreference(e.target.value)} placeholder="Preference" />

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!donated_previously} onChange={(e) => setDonatedPreviously(e.target.checked ? 1 : 0)} /> Donated Previously
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!agree_to_contact} onChange={(e) => setAgreeToContact(e.target.checked ? 1 : 0)} /> Agree to Contact
            </label>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={handleUpdateDonor} className="px-5 py-2 bg-green-600 text-white rounded">Update</button>
            <button onClick={() => setIsEditing(false)} className="px-5 py-2 bg-gray-400 text-white rounded">Cancel</button>
          </div>
        </div>
      )}

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

export default AdminDonors;
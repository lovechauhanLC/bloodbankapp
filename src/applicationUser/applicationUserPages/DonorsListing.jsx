import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;

const DonorsListing = () => {
  const [donors, setDonors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedDonor, setSelectedDonor] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  let token = sessionStorage.getItem("token");
  token = token ? token.replace(/^"|"$/g, "").trim() : "";

  const fetchDonors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/donarsListing?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = res?.data?.response

      setDonors(response)
      setTotalPages(res?.data?.pagination?.totalPages || 1);
      
    } catch (err) {
      console.error("Error fetching donors", err);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [page]);

  const handleApprove = async (donorId) => {
    try {
      await axios.put(
        `${BASE_URL}/updateDonorStatus/${donorId}`,
        { status: "active" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDonors();
      alert("Donor marked as ACTIVE");
      setShowPopup(false);
    } catch (err) {
      console.error("Approve Error", err);
    }
  };

  const handleDelete = async (donorId) => {
    if (!window.confirm("Are you sure you want to delete this donor?")) return;

    try {
      await axios.delete(`${BASE_URL}/deleteDonor/${donorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchDonors();
      alert("Donor deleted successfully");
      setShowPopup(false);
    } catch (err) {
      console.error("Delete Error", err);
      alert("Failed to delete donor");
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Blood Group", "Contact", "State", "City", "Address"];
    const rows = donors.map((d) => [
      d.fullName,
      d.bloodGroup,
      d.mobile,
      d.state,
      d.city,
      d.district,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "donors_list.csv";
    link.click();
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/editDonor/${selectedDonor.donorId}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDonors();
      alert("Donor updated successfully");
      setIsEditing(false);
      setShowPopup(false);
    } catch (err) {
      console.error("Update Error", err);
      alert("Failed to update donor");
    }
  };

  const handleDiscard = async (donorId) => {
    try {
      await axios.put(
        `${BASE_URL}/updateDonorStatus/${donorId}`,
        { status: "inactive" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDonors();
      alert("Donor marked as INACTIVE");
      setShowPopup(false);
    } catch (err) {
      console.error("Discard Error", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-[28px] font-semibold mb-5">Donors</h1>

      <div className="flex justify-end mb-3">
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
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
            {donors.map((donor) => (
              <tr
                key={donor.donorId}
                className={`border-b hover:bg-gray-50 ${
                  donor.status === "inactive" ? "opacity-40" : ""
                }`}
              >
                <td className="px-4 py-3 text-blue-600 font-medium cursor-pointer underline">
                  {donor.fullName}
                </td>
                <td className="px-4 py-3">{donor.bloodGroup}</td>
                <td className="px-4 py-3">{donor.mobile}</td>
                <td className="px-4 py-3">{donor.state}</td>
                <td className="px-4 py-3">{donor.city}</td>
                <td className="px-4 py-3">{donor.district}</td>
                <td
                  className="px-4 py-3 flex items-center gap-3 justify-center cursor-pointer"
                  onClick={() => {
                    setSelectedDonor(donor);
                    setEditData(donor);
                    setIsEditing(false);
                    setShowPopup(true);
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(donor.donorId);
                    }}
                    className="text-green-600 text-xl"
                    title="Approve"
                  >
                    ✔
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(donor.donorId);
                    }}
                    className="text-red-600 text-xl"
                    title="Delete"
                  >
                    🗑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("Edit donor feature here");
                    }}
                    className="text-black text-xl"
                    title="Edit"
                  >
                    ✎
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-2 mt-6">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          ⟨
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-3 py-1 border rounded ${
              page === num ? "bg-green-600 text-white" : ""
            }`}
          >
            {num}
          </button>
        ))}

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

      {showPopup && selectedDonor && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-10 z-50 overflow-y-auto">
          <div className="bg-white w-[75%] max-h-[85vh] overflow-y-auto rounded-xl p-10 shadow-xl">
            
            <h2 className="text-2xl font-semibold mb-10">
              {isEditing ? "Edit Donor Details" : "Donor Details"}
            </h2>

            <div className="grid grid-cols-2 gap-y-6 gap-x-10 text-[16px]">

              {[
                ["Full Name", "fullName"],
                ["Gender (1=Male,2=Female,3=Other)", "gender"],
                ["Date of Birth", "dob"],
                ["Blood Group", "bloodGroup"],
                ["Contact Number", "mobile"],
                ["Email", "email"],
                ["State", "state"],
                ["District", "district"],
                ["City", "city"],
                ["Donation Date", "donation_date"],
                ["Preference", "preference"],
                ["Donated Previously (1=yes,2=no)", "donated_previously"],
                ["Agree To Contact (1=true,0=false)", "agree_to_contact"],
              ].map(([label, key]) => (
                <React.Fragment key={key}>
                  <p className="font-semibold">{label}:</p>

                  {isEditing ? (
                    <input
                      className="border px-3 py-2 rounded w-full"
                      value={editData[key] || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, [key]: e.target.value })
                      }
                    />
                  ) : (
                    <p>{selectedDonor[key] || "N/A"}</p>
                  )}

                </React.Fragment>
              ))}

            </div>

            <div className="flex gap-6 mt-12 justify-center">

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-10 py-3 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              )}

              {isEditing && (
                <>
                  <button
                    onClick={handleUpdate}
                    className="bg-green-600 text-white px-10 py-3 rounded hover:bg-green-700"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditData(selectedDonor);
                    }}
                    className="bg-gray-500 text-white px-10 py-3 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              )}

              <button
                onClick={() => handleApprove(selectedDonor.donorId)}
                className="bg-green-600 text-white px-10 py-3 rounded hover:bg-green-700"
              >
                Accept
              </button>

              <button
                onClick={() => handleDiscard(selectedDonor.donorId)}
                className="bg-orange-500 text-white px-10 py-3 rounded hover:bg-orange-600"
              >
                Discard
              </button>

              <button
                onClick={() => handleDelete(selectedDonor.donorId)}
                className="bg-red-600 text-white px-10 py-3 rounded hover:bg-red-700"
              >
                Delete
              </button>

            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-600 underline hover:text-black"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DonorsListing;
import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;

const DonorsListing = () => {
  const [donors, setDonors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
      await axios.post(`${BASE_URL}/donors/approve`, { donorId });
      fetchDonors();
    } catch (err) {
      console.error("Approve Error", err);
    }
  };

  const handleDelete = async (donorId) => {
    if (!window.confirm("Are you sure you want to delete this donor?")) return;

    try {
      await axios.delete(`${BASE_URL}/donors/${donorId}`);
      fetchDonors();
    } catch (err) {
      console.error("Delete Error", err);
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
              <tr key={donor.donorId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-blue-600 font-medium cursor-pointer underline">
                  {donor.fullName}
                </td>
                <td className="px-4 py-3">{donor.bloodGroup}</td>
                <td className="px-4 py-3">{donor.mobile}</td>
                <td className="px-4 py-3">{donor.state}</td>
                <td className="px-4 py-3">{donor.city}</td>
                <td className="px-4 py-3">{donor.district}</td>
                <td className="px-4 py-3 flex items-center gap-3 justify-center">
                  <button
                    onClick={() => handleApprove(donor.donorId)}
                    className="text-green-600 text-xl"
                    title="Approve"
                  >
                    ✔
                  </button>
                  <button
                    onClick={() => handleDelete(donor.donorId)}
                    className="text-red-600 text-xl"
                    title="Delete"
                  >
                    🗑
                  </button>
                  <button
                    onClick={() => alert("Edit donor feature here")}
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
    </div>
  );
};

export default DonorsListing;
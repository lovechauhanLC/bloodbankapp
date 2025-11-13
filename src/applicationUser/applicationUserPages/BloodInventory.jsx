import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;

const BloodInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [blood_group, setBloodGroup] = useState("A+");
  const [quantity, setQuantity] = useState("");
  const [date_of_collection, setCollectionDate] = useState("");

  let token = sessionStorage.getItem("token");
  token = token ? token.replace(/^"|"$/g, "").trim() : "";

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/bloodInventory`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setInventory(res.data.response || []);
    } catch (err) {
      console.error("Fetch Inventory Error:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddBags = async () => {
    try {
      await axios.post(
        `${BASE_URL}/addBloodInventory`,
        {
          blood_group,
          quantity,
          date_of_collection
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setShowModal(false);
      setQuantity("");
      setCollectionDate("");
      fetchInventory();
    } catch (err) {
      console.error("Add Inventory Error:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-[28px] font-semibold">Blood Inventory</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Add Blood Bags
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {inventory.map((item) => (
          <div
            key={item.blood_group}
            className="shadow rounded-lg p-6 bg-white flex justify-between"
          >
            <div>
              <p className="text-gray-500 text-sm">Bags available</p>
              <p className="text-xl font-semibold">{item.totalQuantity} Bags</p>
            </div>

            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                {item.blood_group}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-end">
          <div className="w-[40%] bg-white h-full p-8 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[22px] font-semibold">Add Blood Bags</h2>
              <button onClick={() => setShowModal(false)}>✖</button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="font-medium">Blood Group</label>
                <select
                  value={blood_group}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1"
                >
                  {[
                    "A+","A-","B+","B-","O+","O-","AB+","AB-","ABO"
                  ].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium">Quantity of Blood Bags</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              </div>

              <div>
                <label className="font-medium">Date of collection</label>
                <input
                  type="date"
                  value={date_of_collection}
                  onChange={(e) => setCollectionDate(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              </div>
            </div>

            <div className="flex justify-between mt-10">
              <button
                onClick={() => setShowModal(false)}
                className="px-8 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddBags}
                className="px-8 py-2 bg-green-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between text-sm mt-10 text-gray-600">
        <p>2023 Developed and Maintained by Velocity.</p>
        <p>Technical Support by Velocity.</p>
      </div>
    </div>
  );
};

export default BloodInventory;
import React, { useState, useEffect } from "react";
import myImg from "../../assets/images/user.svg";

const TopNav = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    try {
      const storedName = sessionStorage.getItem("name");
      const storedId = sessionStorage.getItem("id");
      const storedRole = sessionStorage.getItem("role");

       const cleanedName = storedName ? storedName.replace(/^"|"$/g, "") : "Unknown";
      const cleanedId = storedId ? storedId.replace(/^"|"$/g, "") : "-";
      const cleanedRole = storedRole ? storedRole.replace(/^"|"$/g, "") : "User";

      setName(cleanedName);
      setId(cleanedId);
      setRole(cleanedRole);
    } catch (error) {
      console.error("Error reading session storage:", error);
    }
  }, []);

  return (
    <div className="h-20 border-b border-gray-400 flex justify-end items-center pr-10">
      <div className="flex items-center gap-3">
        <img src={myImg} className="h-10 w-10" alt="user" />
        <div className="flex flex-col text-sm">
          <h3 className="font-semibold">{name}</h3>
          <p>ID: {id}</p>
          <p>Role: {role}</p>
        </div>
      </div>
    </div>
  );
};

export default TopNav;

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = sessionStorage.getItem("token");
  //   if(token){
  //     navigate('/bloodBanks')
  //   }
  // }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      setError("Please fill in both email and password");
      return;
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });

      if (data?.error?.response === "fail") {
        setError("Invalid Credentials");
        return;
      }

      const token = data?.response?.token;
      const user = data?.response?.user;
      

      if (!token || !user) {
        setError("Unexpected server response");
        return;
      }

      const userType = user.userType;


      sessionStorage.setItem("token", JSON.stringify(token));
      sessionStorage.setItem("id", JSON.stringify(user.userId));
      sessionStorage.setItem("name", JSON.stringify(user.name));
      sessionStorage.setItem("user", JSON.stringify(userType));

      if (userType == 1) {
        navigate("/bloodBanks");
      } else if (userType == 2) {
        navigate("/donorList");
      } else {
        navigate("/admin/bloodBanks");
      }

      // if (userType == 1) {
      //   navigate("/bloodBanks");
      // } 
      // else if (userType == 2) {
      //   navigate("/donorList");
      // } else {
      //   navigate("/bloodBanks");
      // }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full bg-[url('/src/assets/images/auth-bg.png')] bg-cover flex items-center pl-20 ">
      <div className="bg-white w-[40%] rounded-lg shadow-lg p-8">
        <div className="flex flex-col mb-4 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-gray-600 text-sm">
            Please enter your details to log into your account
          </p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <label htmlFor="email" className="text-sm font-medium">
            User ID
          </label>
          <input
            name="email"
            type="email"
            placeholder="User ID"
            className="border px-2 py-2 rounded-md"
          />
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="border px-2 py-2 rounded-md"
          />
          <button className="bg-[#e73e32] text-white mt-6 py-2 rounded-md hover:bg-red-600 transition-all duration-200">
            Login
          </button>
        </form>

        <div className="text-center mt-3 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Sign up
          </Link>
        </div>

        {error && (
          <p className="text-red-500 text-center text-xs mt-3 h-4">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Login;

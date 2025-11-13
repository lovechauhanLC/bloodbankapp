import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;

const Register = () => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [load,setLoad] = useState(true)
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    let newErrors = {};

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const gender = e.target.gender.value;
    const contact = e.target.contact.value;
    const city = e.target.city.value;
    const address = e.target.address.value;
    const user_type = "1";

    if (!name) newErrors.name = "Name is required";

    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters long";

    if (contact.length != 10)
      newErrors.contact = "Contact must be at least 10 digits";

    if (!city) newErrors.city = "City is required";
    if (!address) newErrors.address = "Address is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({});
    }
    
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${BASE_URL}/registerApplicationUser`,
        {
          name,
          email,
          password,
          gender,
          phone: contact,
          city,
          address,
          user_type,
        }
      );

      setTimeout(() => {
        setIsLoading(false);
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log("Error in logging: ", error);
    }
  }

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div>
      {
        load ? <div>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-12 h-12 border-4 border-t-transparent border-black border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="h-100vh w-100vw border-2 bg-[url('/src/assets/images/auth-bg.png')] ">
          <div>
            <div className="h-[60%] w-[35%] rounded-lg flex flex-col gap-4 mt-10 mb-10 ml-10 px-6 py-8 bg-white  ">
              <div className="flex flex-col">
                <h1 className="text-3xl">Sign Up</h1>
                <p className="text-lg">Please enter your details to Sign Up.</p>
              </div>
              <form className="flex flex-col" onSubmit={handleSubmit}>
                <label htmlFor="name" className="text-sm">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="border px-2 py-1 rounded-lg text-sm "
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}

                <div className="pt-4 text-sm flex flex-col">
                  Gender
                  <div className="mt-2">
                    <input
                      id="male"
                      name="gender"
                      value="1"
                      type="radio"
                      className="mr-1"
                    />
                    <label htmlFor="male" className="mt-2">
                      Male
                    </label>
                    <input
                      id="female"
                      name="gender"
                      value="2"
                      type="radio"
                      className="ml-4 mr-1"
                    />
                    <label htmlFor="female" className="mt-2">
                      Female
                    </label>
                  </div>
                </div>
                <label htmlFor="email" className="pt-4 text-sm">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="border px-2 py-1 rounded-lg text-sm"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
                <label htmlFor="contact" className="pt-4 text-sm">
                  Contact No.
                </label>
                <input
                  id="contact"
                  type="text"
                  placeholder="Enter your contact number"
                  className="border px-2 py-1 rounded-lg text-sm"
                />
                {errors.contact && (
                  <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
                )}
                <label htmlFor="city" className="pt-4 text-sm">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="Enter your city"
                  className="border px-2 py-1 rounded-lg text-sm"
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
                <label htmlFor="address" className="pt-4 text-sm">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="Enter your address"
                  className="border px-2 py-1 rounded-lg text-sm"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
                <label htmlFor="password" className="pt-4 text-sm">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create your password"
                  className="border px-2 py-1 rounded-lg text-sm"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                <button className="bg-[#e73e32] text-white mt-8 py-1 rounded-lg ">
                  Sign Up
                </button>
              </form>
              <div className="mx-auto">
                <span>
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 underline">
                    Login
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div> : <div>HELLO</div>
      }
    </div>
  );
};

export default Register;

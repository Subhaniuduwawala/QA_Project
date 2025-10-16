import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api"; // axios setup to talk to backend

export default function AdminLogin() {
  const navigate = useNavigate(); // to move to another page after login
  const [formData, setFormData] = useState({ email: "", password: "" }); // store email and password
  const [error, setError] = useState(""); // store error message if login fails

  // run whenever input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // update email or password in state
  };

  // run when user clicks login
  const handleLogin = async (e) => {
    e.preventDefault(); // stop page from refreshing
    setError(""); // clear old error

    // check if fields are empty
    if (!formData.email || !formData.password) {
      setError("Both fields are required."); // show error
      return;
    }

    try {
      // send email and password to backend
      const res = await API.post("/admin/login", {
        email: formData.email,
        password: formData.password,
      });

      // save the token in localStorage
      localStorage.setItem("adminToken", res.data.token);

      // show alert when login is successful
      alert("Welcome back to Planora!");

      // go to admin events page
      navigate("/admin/events"); 
    } catch (err) {
      // show backend error or default message
      setError(err.response?.data.error || "Login failed Invalid Email or Password");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">

      {/* main area */}
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Login
          </h2>

          {/* show error if any */}
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          {/* login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* email input */}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
                placeholder="example@gmail.com"
              />
            </div>
            
            {/* password input */}
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
                placeholder="Enter password"
              />
            </div>

            {/* login button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>

          {/* link to signup page */}
          <p className="text-sm text-gray-500 mt-4 text-center">
            Don't have an account?{" "}
            <span
              className="text-indigo-600 cursor-pointer hover:underline"
              onClick={() => navigate("/admin/signup")}
            >
              Signup
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}

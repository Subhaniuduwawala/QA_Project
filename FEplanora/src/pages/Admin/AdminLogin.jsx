import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import styles from "./AdminAuth.module.css";

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
    <div className={styles.authContainer}>
      <main className={styles.mainContent}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Login</h2>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="example@gmail.com"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter password"
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Login
            </button>
          </form>

          <p className={styles.formFooter}>
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

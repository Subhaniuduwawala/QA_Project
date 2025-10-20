import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import styles from "./AdminAuth.module.css";

export default function AdminSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  // Update form state when input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send request to backend
      await API.post("/admin/signup", { firstName, lastName, email, password });

      // Success alert
      alert(`Welcome to PlanOra, ${firstName}! Please login to continue.`);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to admin login page
      navigate("/admin/login");
    } catch (err) {
      setError(err.response?.data.message || "Signup failed");
    }
  };

  return (
    <div className={styles.authContainer}>
      <main className={styles.mainContent}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Sign Up</h2>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <form onSubmit={handleSignup}>
            <div className={styles.formGroup}>
              <label className={styles.label}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter first name"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter last name"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter email"
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

            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                placeholder="Confirm password"
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Sign Up
            </button>
          </form>

          <p className={styles.formFooter}>
            Already have an account?{" "}
            <span
              className={styles.formFooterLink}
              onClick={() => navigate("/admin/login")}
            >
              Login
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}

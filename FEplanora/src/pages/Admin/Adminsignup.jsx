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
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    // Password strength validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!passwordRegex.test(password)) {
      setError("Password must contain uppercase, lowercase, number, and special character (@$!%*?&).");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send request to backend
      const response = await API.post("/admin/signup", { firstName, lastName, email, password });
      
      console.log("Signup response:", response);

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
      console.error("Signup error:", err);
      console.error("Error response:", err.response);
      
      // Handle validation errors
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors.map(e => e.msg).join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || "Signup failed. Please try again.");
      }
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
              <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                Must be at least 8 characters with uppercase, lowercase, number, and special character
              </small>
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

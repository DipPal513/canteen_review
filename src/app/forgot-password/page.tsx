"use client";
import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    await axios.post("/api/auth/forgot-password", { email });
    alert("Reset email sent!");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="border px-3 py-2 w-full mt-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2 mt-4" onClick={handleSubmit}>
        Send Reset Link
      </button>
    </div>
  );
}

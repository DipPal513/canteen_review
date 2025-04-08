// pages/reset-password/[token].tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    await axios.post("/api/auth/reset-password", {
      token,
      password,
    });
    alert("Password reset successful!");
    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold">Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        className="border px-3 py-2 w-full mt-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-green-600 text-white px-4 py-2 mt-4" onClick={handleReset}>
        Set New Password
      </button>
    </div>
  );
}

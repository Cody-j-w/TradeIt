"use client";
import React, { useState } from "react";

export default function AdminAddSpotForm() {
  const [formData, setFormData] = useState({ name: "", address: "" });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/add-spot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setSuccess(true);
      setFormData({ name: "", address: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2" placeholder="Spot Name" required />
      <input name="address" value={formData.address} onChange={handleChange} className="w-full border p-2" placeholder="Full Address" required />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Trade Spot</button>
      {success && <p className="text-green-600">Trade Spot added!</p>}
    </form>
  );
}

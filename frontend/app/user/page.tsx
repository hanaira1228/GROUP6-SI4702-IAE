"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ambil semua user
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users");
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // tambah user baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Creating user...");

    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("✅ User created successfully!");
        setFormData({ name: "", email: "", password: "" });
        fetchUsers();
      } else {
        const err = await res.json();
        setMessage(`❌ Failed: ${err.message}`);
      }
    } catch (err) {
      setMessage("⚠️ Error connecting to server");
    }
  };

  // hapus user
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("🗑️ User deleted successfully!");
        fetchUsers();
      } else {
        setMessage("❌ Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Error deleting user");
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 text-pink-900 font-sans pb-20">
      {/* Navbar */}
      <nav className="fixed flex justify-center gap-10 py-6 font-medium text-pink-700 bg-pink-100 w-full z-50 shadow-sm">
        <a href="/" className="hover:text-pink-500">HOME</a>
        <a href="#list" className="hover:text-pink-500">USER LIST</a>
        <a href="#register" className="hover:text-pink-500">REGISTER</a>
      </nav>

      {/* Header */}
      <section className="pt-32 text-center">
        <h1 className="text-5xl font-bold text-pink-700">USER MANAGEMENT</h1>
        <p className="mt-3 text-gray-600">Manage users easily with a sweet touch 🍩</p>
      </section>

      {/* Register Form */}
      <section id="register" className="mt-16 flex justify-center px-4">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md text-center space-y-5"
        >
          <h2 className="text-2xl font-semibold text-pink-700">Register New User</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
          />
          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full py-3"
          >
            Create User
          </Button>
          {message && <p className="text-pink-700 mt-2 font-medium">{message}</p>}
        </motion.form>
      </section>

      {/* User List */}
      <section id="list" className="mt-24 px-6">
        <h2 className="text-3xl text-center font-semibold text-pink-700 mb-10">
          User List
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-600">No users found.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {users.map((user) => (
              <motion.div
                key={user._id}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-6 rounded-2xl shadow-md w-64 text-center"
              >
                <p className="font-semibold text-lg text-pink-700">{user.name}</p>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <p className="text-xs mt-2 text-pink-600">Role: {user.role}</p>
                <Button
                  variant="destructive"
                  className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full"
                  onClick={() => handleDelete(user.userId)}
                >
                  Delete
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

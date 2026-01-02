"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface User {
  uuid: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}

const GRAPHQL_URL = "http://localhost:3000/graphql";

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ================= GET ALL USERS =================
  const fetchUsers = async () => {
    try {
      const res = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query GetUsers {
              users {
                uuid
                userId
                name
                email
                role
              }
            }
          `,
        }),
      });

      const json = await res.json();

      if (json.errors) {
        console.error(json.errors);
        setUsers([]);
      } else {
        setUsers(json.data.users ?? []);
      }
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= REGISTER USER =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Creating user...");

    try {
      const res = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation RegisterUser(
              $name: String!
              $email: String!
              $password: String!
            ) {
              register(
                name: $name
                email: $email
                password: $password
              ) {
                uuid
                userId
                name
                email
                role
              }
            }
          `,
          variables: formData,
        }),
      });

      const json = await res.json();

      if (json.errors) {
        setMessage(`❌ ${json.errors[0].message}`);
        return;
      }

      setMessage("✅ User created successfully!");
      setFormData({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Error connecting to server");
    }
  };

  // ================= DELETE USER =================
  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure to delete this user?")) return;

    try {
      const res = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation DeleteUser($uuid: String!) {
              deleteUser(uuid: $uuid)
            }
          `,
          variables: { uuid },
        }),
      });

      const json = await res.json();

      if (json.errors) {
        setMessage(`❌ ${json.errors[0].message}`);
        return;
      }

      setMessage("🗑️ User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Error deleting user");
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 text-pink-900 font-sans pb-20">

      {/* Header */}
      <section className="pt-32 text-center">
        <h1 className="text-5xl font-bold text-pink-700">USER MANAGEMENT</h1>
        <p className="mt-3 text-gray-600">
          Manage users easily with a sweet touch 🍩
        </p>
      </section>

      {/* Register Form */}
      <section className="mt-16 flex justify-center px-4">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md text-center space-y-5"
        >
          <h2 className="text-2xl font-semibold text-pink-700">
            Register New User
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
          />

          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full py-3"
          >
            Create User
          </Button>

          {message && (
            <p className="text-pink-700 mt-2 font-medium">{message}</p>
          )}
        </motion.form>
      </section>

      {/* User List */}
      <section className="mt-24 px-6">
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
                key={user.uuid}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-6 rounded-2xl shadow-md w-64 text-center"
              >
                <p className="font-semibold text-lg text-pink-700">
                  {user.name}
                </p>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <p className="text-xs mt-2 text-pink-600">
                  Role: {user.role}
                </p>
                <Button
                  variant="destructive"
                  className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full"
                  onClick={() => handleDelete(user.uuid)}
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
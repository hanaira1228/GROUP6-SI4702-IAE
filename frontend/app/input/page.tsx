"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Restaurant {
  _id: string;
  name: string;
  address?: string;
  rating?: number;
}

export default function MenuInputPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState<number | "">("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [showNewRestaurant, setShowNewRestaurant] = useState(false);
  const [newRestaurantName, setNewRestaurantName] = useState("");
  const [newRestaurantAddress, setNewRestaurantAddress] = useState("");

  // fetch restaurant list
  const fetchRestaurants = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/restaurants");
      const data = await res.json();
      setRestaurants(data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // add menu
  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurant) return setMessage("Please select a restaurant first.");
    if (!menuName || menuPrice === "") return setMessage("Menu name and price are required.");

    setMessage("Adding menu...");

    try {
      const res = await fetch(
        `http://localhost:3000/api/restaurants/${selectedRestaurant}/menus`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: menuName, price: menuPrice }),
        }
      );

      if (res.ok) {
        setMessage("✅ Menu added successfully!");
        setMenuName("");
        setMenuPrice("");
      } else {
        const err = await res.json();
        setMessage(`❌ Failed: ${err.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error connecting to server");
    }
  };

  // add restaurant
  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestaurantName) return setMessage("Restaurant name is required.");

    setMessage("Adding restaurant...");

    try {
      const res = await fetch("http://localhost:3000/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRestaurantName, address: newRestaurantAddress }),
      });

      if (res.ok) {
        const created = await res.json();
        setRestaurants([...restaurants, created]);
        setSelectedRestaurant(created._id);
        setNewRestaurantName("");
        setNewRestaurantAddress("");
        setShowNewRestaurant(false);
        setMessage("✅ Restaurant added! You can now add a menu.");
      } else {
        const err = await res.json();
        setMessage(`❌ Failed: ${err.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 text-pink-900 font-sans">

      <section className="flex flex-col items-center text-center pt-32 px-4">
        <h1 className="text-4xl font-bold text-pink-700 leading-tight">
          🍽️ Manage Restaurants & Menus
        </h1>
        <p className="mt-3 text-gray-600 text-lg max-w-md">
          Easily add restaurants and menu items all in one place.
        </p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-8"
        >
          <Image
            src="/images/donat-tumpuk.png"
            alt="Menu Illustration"
            width={300}
            height={300}
            className="drop-shadow-lg"
          />
        </motion.div>
      </section>

      <section id="input" className="bg-pink-200 py-16 px-6 text-center mt-12">
        <h2 className="text-3xl font-semibold text-pink-700 mb-6">
          Add Restaurant
        </h2>

        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-5">
          <Button
            type="button"
            onClick={() => setShowNewRestaurant(!showNewRestaurant)}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full px-5 py-3"
          >
            {showNewRestaurant ? "Cancel" : "+ Add New Restaurant"}
          </Button>

          {showNewRestaurant && (
            <form onSubmit={handleAddRestaurant} className="space-y-4 mt-4">
              <input
                type="text"
                placeholder="Restaurant Name"
                value={newRestaurantName}
                onChange={(e) => setNewRestaurantName(e.target.value)}
                required
                className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Address"
                value={newRestaurantAddress}
                onChange={(e) => setNewRestaurantAddress(e.target.value)}
                className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
              />
              <Button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full px-5 py-3"
              >
                Add Restaurant
              </Button>
            </form>
          )}
        </div>
        
        <br />

        <h2 className="text-3xl font-semibold text-pink-700 mb-6">
          Add Menu
        </h2>

        <form
          onSubmit={handleAddMenu}
          className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md mt-8 space-y-5"
        >
          {loading ? (
            <p>Loading restaurants...</p>
          ) : (
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
            >
              <option value="">Select Restaurant</option>
              {restaurants.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name} {r.rating ? `- ⭐ ${r.rating.toFixed(1)}` : ""}
                </option>
              ))}
            </select>
          )}

          <input
            type="text"
            placeholder="Menu Name"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            required
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
            disabled={!selectedRestaurant}
          />

          <input
            type="number"
            placeholder="Menu Price"
            value={menuPrice}
            onChange={(e) => setMenuPrice(Number(e.target.value))}
            required
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
            disabled={!selectedRestaurant}
          />

          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full px-5 py-3"
            disabled={!selectedRestaurant}
          >
            Add Menu
          </Button>

          {message && <p className="text-pink-700 font-medium mt-3">{message}</p>}
        </form>
      </section>
    </div>
  );
}
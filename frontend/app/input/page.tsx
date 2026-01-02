"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Restaurant {
  id: string;
  name: string;
  address?: string;
  rating?: number | null;
}

const GRAPHQL_URL = "http://localhost:3000/graphql";

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

  // ================= FETCH RESTAURANTS =================
  const fetchRestaurants = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              restaurants {
                id
                name
                rating
              }
            }
          `,
        }),
      });

      const json = await res.json();

      if (json.errors) {
        console.error(json.errors);
        setRestaurants([]);
        setMessage("❌ Failed to load restaurants");
        return;
      }

      setRestaurants(json.data?.restaurants ?? []);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // ================= ADD MENU =================
  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!selectedRestaurant)
      return setMessage("Please select a restaurant first.");
    if (!menuName || menuPrice === "")
      return setMessage("Menu name and price are required.");

    setMessage("Adding menu...");

    try {
      const res = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation AddMenu($restaurantId: ID!, $menu: MenuInput!) {
              addMenu(restaurantId: $restaurantId, menu: $menu) {
                id
                name
              }
            }
          `,
          variables: {
            restaurantId: selectedRestaurant,
            menu: {
              name: menuName,
              price: Number(menuPrice),
            },
          },
        }),
      });

      const json = await res.json();

      if (json.errors) {
        setMessage(`❌ ${json.errors[0].message}`);
        return;
      }

      setMessage("✅ Menu added successfully!");
      setMenuName("");
      setMenuPrice("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error connecting to server");
    }
  };

  // ================= ADD RESTAURANT =================
  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!newRestaurantName)
      return setMessage("Restaurant name is required.");

    setMessage("Adding restaurant...");

    try {
      const res = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation CreateRestaurant($data: RestaurantInput!) {
              createRestaurant(data: $data) {
                id
                name
                address
                rating
              }
            }
          `,
          variables: {
            data: {
              name: newRestaurantName,
              address: newRestaurantAddress || null,
            },
          },
        }),
      });

      const json = await res.json();

      if (json.errors) {
        setMessage(`❌ ${json.errors[0].message}`);
        return;
      }

      const created: Restaurant = json.data.createRestaurant;

      setRestaurants((prev) => [...prev, created]);
      setSelectedRestaurant(created.id);
      setNewRestaurantName("");
      setNewRestaurantAddress("");
      setShowNewRestaurant(false);
      setMessage("✅ Restaurant added! You can now add a menu.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 text-pink-900 font-sans">
      {/* HERO */}
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

      {/* INPUT */}
      <section className="bg-pink-200 py-16 px-6 text-center mt-12">
        {/* ADD RESTAURANT */}
        <h2 className="text-3xl font-semibold text-pink-700 mb-6">
          Add Restaurant
        </h2>

        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-5">
          <Button
            type="button"
            onClick={() => setShowNewRestaurant((v) => !v)}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full px-5 py-3"
          >
            {showNewRestaurant ? "Cancel" : "+ Add New Restaurant"}
          </Button>

          {showNewRestaurant && (
            <form onSubmit={handleAddRestaurant} className="space-y-4">
              <input
                type="text"
                placeholder="Restaurant Name"
                value={newRestaurantName}
                onChange={(e) => setNewRestaurantName(e.target.value)}
                required
                className="w-full p-3 rounded-full bg-pink-100 border border-pink-300"
              />
              <input
                type="text"
                placeholder="Address"
                value={newRestaurantAddress}
                onChange={(e) => setNewRestaurantAddress(e.target.value)}
                className="w-full p-3 rounded-full bg-pink-100 border border-pink-300"
              />
              <Button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full"
              >
                Add Restaurant
              </Button>
            </form>
          )}
        </div>

        {/* ADD MENU */}
        <h2 className="text-3xl font-semibold text-pink-700 mt-16 mb-6">
          Add Menu
        </h2>

        <form
          onSubmit={handleAddMenu}
          className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md space-y-5"
        >
          {loading ? (
            <p>Loading restaurants...</p>
          ) : (
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              className="w-full p-3 rounded-full bg-pink-100 border border-pink-300"
            >
              <option value="">Select Restaurant</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                  {typeof r.rating === "number"
                    ? ` - ⭐ ${r.rating.toFixed(1)}`
                    : ""}
                </option>
              ))}
            </select>
          )}

          <input
            type="text"
            placeholder="Menu Name"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            disabled={!selectedRestaurant}
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300"
          />

          <input
            type="number"
            placeholder="Menu Price"
            value={menuPrice}
            onChange={(e) => setMenuPrice(Number(e.target.value))}
            disabled={!selectedRestaurant}
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300"
          />

          <Button
            type="submit"
            disabled={!selectedRestaurant}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full"
          >
            Add Menu
          </Button>

          {message && (
            <p className="text-pink-700 font-medium mt-3">{message}</p>
          )}
        </form>
      </section>
    </div>
  );
}
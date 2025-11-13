"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Menu {
  _id: string;
  name: string;
  price: number;
  restaurant: {
    _id: string;
    name: string;
  };
}

interface Restaurant {
  _id: string;
  name: string;
}

interface ApiMenu {
  _id: string;
  name: string;
  price: number;
  restaurant?: {
    _id: string;
    name: string;
  };
}

export default function MenusPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(""); // "" = all menus
  const [menus, setMenus] = useState<Menu[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const LIMIT = 6;

  // fetch all restaurants for dropdown
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/restaurants");
        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load restaurants");
      }
    };
    loadRestaurants();
  }, []);

  // fetch menus whenever selectedRestaurant or page changes
  useEffect(() => {
    const loadMenus = async () => {
      setLoading(true);
      try {
        const url = selectedRestaurant
          ? `http://localhost:3000/api/restaurants/${selectedRestaurant}/menus?page=${page}&limit=${LIMIT}`
          : `http://localhost:3000/api/restaurants/menus?page=${page}&limit=${LIMIT}`;

        const res = await fetch(url);
        const data = await res.json();

        const safeMenus: Menu[] = data.menus.map((menu: ApiMenu) => ({
          _id: menu._id,
          name: menu.name,
          price: menu.price,
          restaurant: {
            _id: menu.restaurant?._id || "",
            name: menu.restaurant?.name || "Unknown",
          },
        }));

        setMenus(safeMenus);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load menus");
        setMenus([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    loadMenus();
  }, [selectedRestaurant, page]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="min-h-screen bg-pink-100 text-pink-900 font-sans px-6 py-16 pt-32">
      <h1 className="text-4xl font-bold text-center text-pink-700 mb-8">
        🍔 Menus
      </h1>

      {/* dropdown select */}
      <div className="max-w-md mx-auto mb-8">
        <select
          className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
          value={selectedRestaurant}
          onChange={(e) => {
            setSelectedRestaurant(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Menus</option>
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center">Loading menus...</p>
      ) : menus.length === 0 ? (
        <p className="text-center">No menus found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {menus.map((menu) => (
            <div
              key={menu._id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-xl mb-2">{menu.name}</h3>
              <p className="text-gray-500 mb-2">
                Price: Rp {menu.price.toLocaleString()}
              </p>
              <p className="text-gray-500">
                Restaurant:{" "}
                {menu.restaurant._id ? (
                  <Link
                    href={`/restaurants/${menu.restaurant._id}`}
                    className="text-pink-600 hover:underline"
                  >
                    {menu.restaurant.name}
                  </Link>
                ) : (
                  <span className="text-gray-400">{menu.restaurant.name}</span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* pagination */}
      {menus.length > 0 && (
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={handlePrev}
            disabled={page === 1}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            Prev
          </Button>
          <span className="flex items-center text-gray-700">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={handleNext}
            disabled={page === totalPages}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            Next
          </Button>
        </div>
      )}

      {message && <p className="text-pink-700 font-medium mt-6 text-center">{message}</p>}
    </div>
  );
}
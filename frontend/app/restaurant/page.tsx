"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Restaurant {
  id: string;
  name: string;
  address?: string;
  rating?: number;
  menus?: Array<{
    name: string;
    price: number;
  }>;
}

const GRAPHQL_URL = "http://localhost:3000/graphql";

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data restoran dari GraphQL
  useEffect(() => {
    const fetchRestaurants = async () => {
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
                  address
                  rating
                  menus {
                    name
                    price
                  }
                }
              }
            `,
          }),
        });

        // Check if response is OK and content type is JSON
        if (!res.ok) {
          const text = await res.text();
          console.error("HTTP Error:", res.status, text.substring(0, 200));
          setError(`HTTP ${res.status}: Failed to fetch restaurants. Make sure API Gateway is running on port 3000.`);
          setRestaurants([]);
          setLoading(false);
          return;
        }

        // Check content type
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Invalid response type. Expected JSON, got:", contentType);
          console.error("Response preview:", text.substring(0, 200));
          setError("Invalid response from server. Make sure API Gateway is running and GraphQL endpoint is accessible.");
          setRestaurants([]);
          setLoading(false);
          return;
        }

        const json = await res.json();

        if (json.errors) {
          console.error("GraphQL errors:", json.errors);
          setError(`GraphQL Error: ${json.errors[0]?.message || "Unknown error"}`);
          setRestaurants([]);
          setLoading(false);
          return;
        }

        setRestaurants(json.data?.restaurants ?? []);
        setError(null); // Clear error on success
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        if (err instanceof Error) {
          console.error("Error message:", err.message);
          if (err.message.includes("JSON")) {
            setError("Cannot connect to API Gateway. Make sure it's running on http://localhost:3000");
          } else {
            setError(`Error: ${err.message}`);
          }
        } else {
          setError("Failed to fetch restaurants. Check console for details.");
        }
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-pink-100 text-pink-900 font-sans">

      {/* Header */}
      <section className="flex flex-col items-center text-center pt-32 px-4">
        <h1 className="text-4xl font-bold text-pink-700 leading-tight">
          🍴 Explore Our Lovely Restaurants
        </h1>
        <p className="mt-3 text-gray-600 text-lg max-w-md">
          Discover the best places to enjoy delicious meals around you!
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-8"
        >
          <Image
            src="/images/donat-tumpuk.png"
            alt="Restaurant Illustration"
            width={300}
            height={300}
            className="drop-shadow-lg"
          />
        </motion.div>
      </section>

      {/* Restaurant List */}
      <section id="restaurant" className="bg-pink-200 py-16 px-6 text-center mt-12">
        <h2 className="text-3xl font-semibold text-pink-700 mb-8">
          Daftar Restoran
        </h2>

        {loading ? (
          <p className="text-pink-700">Loading...</p>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto">
            <p className="font-bold">Error loading restaurants:</p>
            <p className="text-sm mt-2">{error}</p>
            <p className="text-xs mt-4 text-gray-600">
              💡 Make sure API Gateway is running: <code className="bg-red-200 px-2 py-1 rounded">cd api-gateway && npm start</code>
            </p>
          </div>
        ) : restaurants.length === 0 ? (
          <p className="text-pink-700">Belum ada restoran terdaftar.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {restaurants.map((r) => (
              <motion.div
                key={r.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 text-left"
              >
                <h3 className="text-2xl font-semibold text-pink-700 mb-2">{r.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{r.address || "No address"}</p>

                <div className="flex items-center mb-3">
                  <span className="text-yellow-500 text-lg mr-1">⭐</span>
                  <span className="text-gray-700 font-medium">
                    {r.rating ? r.rating.toFixed(1) : "N/A"}
                  </span>
                </div>

                {r.menus && r.menus.length > 0 ? (
                  <div>
                    <h4 className="text-pink-600 font-semibold mb-1">Menu Unggulan:</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm">
                      {r.menus.map((menu, index) => (
                        <li key={index}>
                          {menu.name} - Rp {menu.price?.toLocaleString("id-ID")}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">Belum ada menu.</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

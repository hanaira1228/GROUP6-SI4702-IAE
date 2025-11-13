"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Restaurant {
  _id: string;
  name: string;
  address?: string;
  rating?: number;
  menus?: string[];
}

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data restoran dari API
  useEffect(() => {
    fetch("http://localhost:3000/api/restaurants")
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-pink-100 text-pink-900 font-sans">
      {/* Navbar */}
      <nav className="fixed flex justify-center gap-10 py-6 font-medium text-pink-700 bg-pink-100 w-full z-50 shadow-sm">
        <a href="/" className="hover:text-pink-500">HOME</a>
        <a href="#restaurant" className="hover:text-pink-500">RESTAURANTS</a>
      </nav>

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
        ) : restaurants.length === 0 ? (
          <p className="text-pink-700">Belum ada restoran terdaftar.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {restaurants.map((r) => (
              <motion.div
                key={r._id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 text-left"
              >
                <h3 className="text-2xl font-semibold text-pink-700 mb-2">{r.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{r.address}</p>

                <div className="flex items-center mb-3">
                  <span className="text-yellow-500 text-lg mr-1">⭐</span>
                  <span className="text-gray-700 font-medium">{r.rating ?? "N/A"}</span>
                </div>

                {r.menus && r.menus.length > 0 ? (
                  <div>
                    <h4 className="text-pink-600 font-semibold mb-1">Menu Unggulan:</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm">
                      {r.menus.map((menu, index) => (
                        <li key={index}>{menu}</li>
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

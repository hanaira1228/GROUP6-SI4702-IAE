"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Restaurant {
  _id: string;
  name: string;
  image?: string;
  description?: string;
}

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [name, setName] = useState("");
  const [menu, setMenu] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/restaurants")
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Sending order...");

    try {
      const res = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          restaurantName: menu,
          quantity,
        }),
      });

      if (res.ok) {
        setMessage("Order created successfully!");
        setName("");
        setMenu("");
        setQuantity(1);
      } else {
        const err = await res.json();
        setMessage(`Failed: ${err.message || "unknown error"}`);
      }
    } catch (err) {
      setMessage("Error sending order");
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 text-pink-900 font-sans">
      {/* Navbar */}
      <nav className="fixed flex justify-center gap-10 py-6 font-medium text-pink-700 bg-pink-100 w-full z-50 shadow-sm">
        <a href="#about" className="hover:text-pink-500 font-bold">ABOUT US</a>
        <a href="#order" className="hover:text-pink-500 font-bold">ORDER ONLINE</a>
        <a href="#menu" className="hover:text-pink-500 font-bold">MENU</a>
        <a href="#locations" className="hover:text-pink-500 font-bold">LOCATIONS</a>
        <a href="#contact" className="hover:text-pink-500 font-bold">CONTACT US</a>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center pt-32 px-4">
        <h1 className="text-5xl font-bold text-pink-700 leading-tight">
          DELIVA
        </h1>
        <p className="mt-3 text-gray-600 text-lg max-w-md">
          Dive into our world of deliciously dipped creations.
        </p>
        <Button className="mt-5 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold px-6 py-3 text-lg">
          Start Delivery
        </Button>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-2"
        >
          <Image
            src="/images/donat-merah.png"
            alt="Donut"
            width={300}
            height={300}
            className="drop-shadow-lg"
          />
        </motion.div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="mt-24 bg-pink-200 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-pink-700">Our Cafe</h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading menu...</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {restaurants.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center w-64"
              >
                <Image
                  src={item.image || "/images/donat-tumpuk.png"}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="mx-auto"
                />
                <h3 className="mt-4 font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  {item.description || "Freshly dipped and delicious!"}
                </p>
                <Button className="mt-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full px-5">
                  ORDER
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Build Your Own */}
      <section id="order" className="py-20 flex flex-col md:flex-row items-center justify-center gap-12 px-6">
        <div className="max-w-sm mr-40">
          <Image
            src="/images/donat-tumpuk.png"
            alt="Custom Donuts"
            width={350}
            height={350}
          />
        </div>

        <div className="text-center md:text-left">
          <h2 className="text-3xl font-semibold text-pink-700 mb-6">
            Build Your Own.
          </h2>
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((n) => (
              <select
                key={n}
                className="p-3 rounded-full bg-pink-200 text-pink-800 font-medium focus:outline-none"
              >
                <option>Choose your dip {n}</option>
              </select>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section className="bg-pink-200 py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold text-pink-700 mb-6">Place Your Order</h2>
        <form
          onSubmit={handleOrder}
          className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md space-y-5"
        >
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
          />

          <select
            value={menu}
            onChange={(e) => setMenu(e.target.value)}
            required
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
          >
            <option value="">Select Menu</option>
            {restaurants.map((r) => (
              <option key={r._id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
          />

          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full px-5 py-3"
          >
            Submit Order
          </Button>

          {message && (
            <p className="text-pink-700 font-medium mt-3">{message}</p>
          )}
        </form>
      </section>
    </div>
  );
}
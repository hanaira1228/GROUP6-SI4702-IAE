"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Menu {
  _id: string;
  name: string;
  price: number;
  restaurant: {
    _id: string;
    name: string;
  };
  image?: string;
}

interface MenusApiResponse {
  menus: Menu[];
  totalPages?: number;
}

export default function HomePage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [name, setName] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/restaurants/menus?limit=20&page=1")
      .then((res) => res.json())
      .then((data: MenusApiResponse) => {
        // pastikan restaurant selalu ada
        const safeMenus: Menu[] = data.menus.map((menu) => ({
          ...menu,
          restaurant: menu.restaurant || { _id: "", name: "Unknown" },
        }));
        setMenus(safeMenus);
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
          menuName: selectedMenu,
          quantity,
        }),
      });

      if (res.ok) {
        setMessage("Order created successfully!");
        setName("");
        setSelectedMenu("");
        setQuantity(1);
      } else {
        const errorResponse = await res.json();
        setMessage(`Failed: ${errorResponse.message || "unknown error"}`);
      }
    } catch {
      setMessage("Error sending order");
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 text-pink-900 font-sans">
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
          <h2 className="text-3xl font-semibold text-pink-700">Our Dips</h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading menu...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto place-items-center">
            {menus.map((menu) => (
              <motion.div
                key={menu._id}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <Image
                  src={menu.image || "/images/donat-tumpuk.png"}
                  alt={menu.name}
                  width={150}
                  height={150}
                  className="mx-auto"
                />
                <h3 className="mt-4 font-semibold text-lg">{menu.name}</h3>
                <p className="text-gray-500">Rp {menu.price.toLocaleString()}</p>
                <p className="text-gray-500 text-sm mt-1">
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
                <Button className="mt-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full px-5">
                  ORDER
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Order Form */}
      <section id="order" className="bg-pink-200 py-16 px-6 text-center">
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
            value={selectedMenu}
            onChange={(e) => setSelectedMenu(e.target.value)}
            required
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
          >
            <option value="">Select Menu</option>
            {menus.map((m) => (
              <option key={m._id} value={m.name}>
                {m.name} - {m.restaurant.name}
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

          {message && <p className="text-pink-700 font-medium mt-3">{message}</p>}
        </form>
      </section>
    </div>
  );
}
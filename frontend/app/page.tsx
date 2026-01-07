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

// Helper function to get image based on menu name
const getMenuImage = (menuName: string): string => {
  const name = menuName.toLowerCase();
  
  // Mapping berdasarkan kata kunci
  if (name.includes("ayam") || name.includes("chicken") || name.includes("daging")) {
    return "/images/donat-merah.png";
  }
  if (name.includes("beef") || name.includes("steak") || name.includes("sapi")) {
    return "/images/pink-donut.png";
  }
  if (name.includes("sushi") || name.includes("salmon") || name.includes("ikan") || name.includes("seafood")) {
    return "/images/donat-tumpuk.png";
  }
  if (name.includes("pasta") || name.includes("spaghetti") || name.includes("noodle")) {
    return "/images/donat-merah.png";
  }
  if (name.includes("pizza") || name.includes("burger") || name.includes("sandwich")) {
    return "/images/pink-donut.png";
  }
  if (name.includes("dessert") || name.includes("cake") || name.includes("donut") || name.includes("sweet")) {
    return "/images/donat-tumpuk.png";
  }
  
  // Default image
  return "/images/donat-tumpuk.png";
};

export default function HomePage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [name, setName] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch 5 latest menus for "Our Dips" section
    fetch("http://localhost:3000/api/restaurants/menus/latest?limit=5")
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

  // Fetch all menus for order dropdown
  const [allMenus, setAllMenus] = useState<Menu[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/restaurants/menus?limit=100&page=1")
      .then((res) => res.json())
      .then((data: MenusApiResponse) => {
        const safeMenus: Menu[] = data.menus.map((menu) => ({
          ...menu,
          restaurant: menu.restaurant || { _id: "", name: "Unknown" },
        }));
        setAllMenus(safeMenus);
      })
      .catch(() => {});
  }, []);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return; // Prevent double submission
    }

    setMessage("Sending order...");
    setIsSubmitting(true);

    if (!name.trim()) {
      setMessage("❌ Please enter your name");
      setIsSubmitting(false);
      return;
    }

    if (!selectedMenu) {
      setMessage("❌ Please select a menu");
      setIsSubmitting(false);
      return;
    }

    let menuData;
    try {
      menuData = JSON.parse(selectedMenu);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      setMessage("❌ Invalid menu data. Please select a menu again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const totalPrice = menuData.price * quantity;

      const orderData = {
        customerName: name.trim(),
        restaurantId: menuData.restaurantId,
        items: [
          {
            name: menuData.name,
            price: menuData.price,
            quantity: quantity,
          },
        ],
        totalPrice: totalPrice,
      };

      console.log("Sending order:", orderData);

      try {
        const res = await fetch("http://localhost:3000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        console.log("Response received:", res.status, res.statusText);

        if (!res.ok) {
          let errorData;
          try {
            errorData = await res.json();
          } catch {
            errorData = { message: `HTTP ${res.status}: ${res.statusText}` };
          }
          console.error("Order failed:", errorData);
          setMessage(`❌ Failed: ${errorData.message || `HTTP ${res.status}`}`);
          setIsSubmitting(false);
          return;
        }

        const data = await res.json();
        console.log("Order created successfully:", data);

        setMessage("✅ Order created successfully!");
        setName("");
        setSelectedMenu("");
        setQuantity(1);
        setIsSubmitting(false);
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        const errorMessage = fetchError instanceof Error ? fetchError.message : "Failed to send order. Please check if order service is running.";
        setMessage(`❌ Error: ${errorMessage}`);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Order error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to send order. Please check if order service is running.";
      setMessage(`❌ Error: ${errorMessage}`);
      setIsSubmitting(false);
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
        <Button
          onClick={() => {
            document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="mt-5 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold px-6 py-3 text-lg"
        >
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
                  src={menu.image || getMenuImage(menu.name)}
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
            {allMenus.map((m) => (
              <option key={m._id} value={JSON.stringify({ id: m._id, name: m.name, price: m.price, restaurantId: m.restaurant._id })}>
                {m.name} - {m.restaurant.name} (Rp {m.price.toLocaleString()})
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
            disabled={isSubmitting}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Submit Order"}
          </Button>

          {message && <p className="text-pink-700 font-medium mt-3">{message}</p>}
        </form>
      </section>
    </div>
  );
}
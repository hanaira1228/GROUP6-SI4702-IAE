"use client";

import { useEffect, useState } from "react";

export default function OrderPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [items, setItems] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [message, setMessage] = useState("");

  // Ambil data restoran dari API
  useEffect(() => {
    fetch("http://localhost:3000/api/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.error(err));
  }, []);

  // Fungsi submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Sending order...");

    try {
      const res = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          restaurantId,
          items: items.split(",").map((item) => item.trim()),
          totalPrice: Number(totalPrice),
        }),
      });

      if (res.ok) {
        setMessage("✅ Order placed successfully!");
        setCustomerName("");
        setRestaurantId("");
        setItems("");
        setTotalPrice("");
      } else {
        const err = await res.json();
        setMessage(`❌ Failed: ${err.message || "Unknown error"}`);
      }
    } catch (error) {
      setMessage("❌ Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 text-pink-900 font-sans">
      {/* Navbar */}
      <nav className="fixed flex justify-center gap-10 py-6 font-medium text-pink-700 bg-pink-100 w-full z-50 shadow-sm">
        <a href="/" className="hover:text-pink-500">HOME</a>
        <a href="#order" className="hover:text-pink-500">PLACE ORDER</a>
      </nav>

      {/* Header */}
      <section className="flex flex-col items-center text-center pt-32 px-4">
        <h1 className="text-4xl font-bold text-pink-700 leading-tight">
          🛒 Place Your Order
        </h1>
        <p className="mt-3 text-gray-600 text-lg max-w-md">
          Fill out the form below to place an order at your favorite restaurant.
        </p>
      </section>

      {/* Order Form */}
      <section id="order" className="bg-pink-200 py-16 px-6 text-center mt-12">
        <h2 className="text-3xl font-semibold text-pink-700 mb-6">
          Order Form
        </h2>

        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md space-y-5"
        >
          <input
            type="text"
            placeholder="Your Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
          />

          <select
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            required
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
          >
            <option value="">Select Restaurant</option>
            {restaurants.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Items (comma separated)"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            required
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
          />

          <input
            type="number"
            placeholder="Total Price"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
            required
            className="w-full p-3 rounded-full bg-pink-100 border border-pink-300 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full px-5 py-3"
          >
            Place Order
          </button>

          {message && <p className="text-pink-700 font-medium mt-3">{message}</p>}
        </form>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  customerName: string;
  restaurantId: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setMessage("");
      try {
        const res = await fetch("http://localhost:3000/api/orders");
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleDelete = async (id: string) => {
    const order = orders.find((o) => o._id === id);
    const orderInfo = order
      ? `Order #${order._id.slice(-6)} - ${order.customerName}`
      : "this order";

    const confirmed = confirm(
      `⚠️ Are you sure you want to delete ${orderInfo}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("Deleting order...");
      const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setOrders(orders.filter((order) => order._id !== id));
        setMessage("✅ Order deleted successfully");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to delete order");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error deleting order");
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    // Admin only - simple check (in production, use proper authentication)
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    
    if (!isAdmin) {
      const confirmAdmin = confirm(
        "⚠️ Status update is restricted to admin only.\n\nDo you want to continue as admin?"
      );
      
      if (!confirmAdmin) {
        return;
      }
      
      // Set admin flag for this session
      localStorage.setItem("isAdmin", "true");
    }
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(
          orders.map((order) =>
            order._id === id ? { ...order, status: updatedOrder.status } : order
          )
        );
        setMessage("✅ Order status updated");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to update order status");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error updating order status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 text-pink-900 font-sans px-6 py-16 pt-32">
      <h1 className="text-4xl font-bold text-center text-pink-700 mb-8">
        🛒 Orders
      </h1>

      {message && (
        <p className="text-center text-pink-700 font-medium mb-4">{message}</p>
      )}

      {loading ? (
        <p className="text-center">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">No orders found.</p>
          <Link href="/">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6 py-3">
              Place Your First Order
            </Button>
          </Link>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-xl mb-2">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-gray-600">
                    Customer: <span className="font-medium">{order.customerName}</span>
                  </p>
                  <p className="text-gray-600">
                    Restaurant ID: <span className="font-medium">{order.restaurantId}</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Created: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <Button
                    onClick={() => handleDelete(order._id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-pink-50 p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × Rp {item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-semibold">
                        Rp {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleStatusUpdate(order._id, "Preparing")}
                    disabled={order.status === "Preparing"}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 disabled:opacity-50"
                  >
                    Preparing
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(order._id, "Ready")}
                    disabled={order.status === "Ready"}
                    className="bg-purple-500 hover:bg-purple-600 text-white text-sm px-3 py-1 disabled:opacity-50"
                  >
                    Ready
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(order._id, "Delivered")}
                    disabled={order.status === "Delivered"}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 disabled:opacity-50"
                  >
                    Delivered
                  </Button>
                </div>
                <p className="text-xl font-bold text-pink-700">
                  Total: Rp {order.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


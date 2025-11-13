"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-pink-100 text-pink-900 font-sans">
      {/* Navbar */}
      <nav className="fixed flex justify-center gap-10 py-6 font-medium text-pink-700">
        <a href="#about" className="hover:text-pink-500">ABOUT US</a>
        <a href="#order" className="hover:text-pink-500">ORDER ONLINE</a>
        <a href="#menu" className="hover:text-pink-500">MENU</a>
        <a href="#locations" className="hover:text-pink-500">LOCATIONS</a>
        <a href="#contact" className="hover:text-pink-500">CONTACT US</a>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center pt-10 px-4">
        <h1 className="text-5xl font-bold text-pink-700">DIPPIN&apos; <br /> DONUTS</h1>
        <p className="mt-3 text-gray-600 text-lg max-w-md">
          Dive into our world of deliciously dipped creations.
        </p>
        <Button className="mt-5 bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6 py-3 text-lg">
          Start Dippin’
        </Button>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-10"
        >
          <Image
            src="/images/pink-donut.png"
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

        <div className="flex flex-wrap justify-center gap-8">
          {[
            { name: "CLASSIC DIPS", img: "/images/choco-donut.png" },
            { name: "ADVENTURE DIPS", img: "/images/pink-sprinkle.png" },
            { name: "SEASON'S DIPPIN'", img: "/images/yellow-donut.png" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg text-center w-64"
            >
              <Image
                src={item.img}
                alt={item.name}
                width={150}
                height={150}
                className="mx-auto"
              />
              <h3 className="mt-4 font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet.</p>
              <Button className="mt-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full px-5">
                ORDER
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Build Your Own */}
      <section className="py-20 flex flex-col md:flex-row items-center justify-center gap-12 px-6">
        <div className="max-w-sm">
          <Image
            src="/images/donuts-group.png"
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
                <option>Lorem ipsum dolor</option>
              </select>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
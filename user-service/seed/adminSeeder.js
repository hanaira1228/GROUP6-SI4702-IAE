import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    const exists = await User.findOne({ role: "admin" });
    if (exists) return;

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      userId: 0,
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    console.log("✅ Admin seeded");
  } catch (err) {
    console.error(err);
  }
};

seedAdmin();
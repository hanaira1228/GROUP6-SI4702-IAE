import User from "../models/User.js";
import bcrypt from "bcryptjs";

// helper buat next userId
let nextUserId = 1;

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ 
      userId: nextUserId++,
      name,
      email,
      password: hashedPassword,
      role: "user"
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const getUser = async (req, res) => {
  const { id } = req.params;

  // validasi id
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = await User.findOne({ userId: Number(id) });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({ userId: Number(req.params.id) });
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, email, password } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = await bcrypt.hash(password, 10);

  await user.save();
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const user = await User.findOneAndDelete({ userId: Number(req.params.id) });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted successfully" });
};
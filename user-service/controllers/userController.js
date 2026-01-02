import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Create User
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // cek userId terakhir
    const lastUser = await User.findOne().sort({ userId: -1 });
    const userId = lastUser ? lastUser.userId + 1 : 1;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userId,
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

// Get all users
export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Get single user by userId
export const getUser = async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = await User.findOne({ userId: id });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Update user
export const updateUser = async (req, res) => {
  const id = Number(req.params.id);
  const user = await User.findOne({ userId: id });

  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, email, password } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = await bcrypt.hash(password, 10);

  await user.save();
  res.json(user);
};

// Delete user
export const deleteUser = async (req, res) => {
  const id = Number(req.params.id);
  const user = await User.findOneAndDelete({ userId: id });

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted successfully" });
};
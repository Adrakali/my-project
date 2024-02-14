import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  //check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    return res.status(400).json({ error: "User already exists" });
  }

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({
      email,
      password: hashedPassword,
    });
    const token = generateToken(user._id);
    res.status(201).json({ email, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  // Grab data from request body
  const { email, password } = req.body;

  // Check the fields are not empty
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Check if email already exist
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Incorrect email." });
  }

  // Check password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ error: "Incorrect password." });
  }

  try {
    // Create the JsonWebToken
    const token = generateToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { registerUser, loginUser };

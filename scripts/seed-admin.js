import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

const MONGODB_URI = process.env.MONGODB_URI;

async function seedAdmin() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI not set in environment.");
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  const email = "admin@example.com";
  const password = "admin123";
  const name = "Admin";
  const role = "admin";

  let user = await User.findOne({ email });
  if (user) {
    console.log("Admin user already exists:", email);
  } else {
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashed, role });
    console.log("Admin user created:", email);
  }
  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});

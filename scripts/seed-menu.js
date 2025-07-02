import mongoose from "mongoose";
import "dotenv/config";
import Menu from "../models/menu.js";
import { menuItems } from "../data/menu-data.js";

const MONGODB_URI = process.env.MONGODB_URI;

async function seedMenu() {
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }
  await mongoose.connect(MONGODB_URI);
  await Menu.deleteMany({}); // Clear existing
  await Menu.insertMany(menuItems.map(({ id, ...item }) => item));
  console.log("Menu seeded!");
  await mongoose.disconnect();
}

seedMenu().catch((err) => {
  console.error(err);
  process.exit(1);
});

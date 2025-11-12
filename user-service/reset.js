import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: true
})
.then(async () => {
  console.log("MongoDB connected, dropping database...");
  await mongoose.connection.dropDatabase();
  console.log("✅ Database dropped!");
  process.exit(0);
})
.catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
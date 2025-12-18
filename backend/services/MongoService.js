// backend/services/MongoService.js

import mongoose from "mongoose";

export function connectMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("❌ MONGO_URI not set in .env");
  }

  mongoose.connect(uri);

  mongoose.connection.once("open", () => {
    console.log("✅ MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB error:", err.message);
  });
}

const alertSchema = new mongoose.Schema({
  coinId: { type: String, required: true },
  direction: { type: String, enum: ["ABOVE", "BELOW"], required: true },
  targetPrice: { type: Number, required: true },
  email: { type: String, default: null },
  phoneNumber: { type: String, default: null },
  createdAt: { type: Number, default: Date.now },
  triggered: { type: Boolean, default: false },
});

const Alert = mongoose.model("Alert", alertSchema);

export async function saveAlert(alertData) {
  try {
    const doc = new Alert(alertData);
    const saved = await doc.save();
    return saved._id.toString();
  } catch (err) {
    console.error("❌ Failed to save alert:", err.message);
    throw err;
  }
}

export async function getAlerts() {
  try {
    return await Alert.find({});
  } catch (err) {
    console.error("❌ Failed to fetch alerts:", err.message);
    return [];
  }
}

export async function deleteAlert(id) {
  try {
    return await Alert.findByIdAndDelete(id);
  } catch (err) {
    console.error("❌ Failed to delete alert:", err.message);
    return null;
  }
}

export async function updateAlert(id, update) {
  try {
    return await Alert.findByIdAndUpdate(id, update, { new: true });
  } catch (err) {
    console.error("❌ Failed to update alert:", err.message);
    return null;
  }
}

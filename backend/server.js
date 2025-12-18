// backend/server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Notifier } from "./services/Notifier.js";
import { fetchTopCoins } from "./services/CoinGecko.js";
import { connectMongo, saveAlert, getAlerts, updateAlert } from "./services/MongoService.js";
import { startPriceStream } from "./services/WebSocket.js";

dotenv.config();

connectMongo();

const app = express();
const listeningPort = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "Backend alive",
    service: "Crypto Alert Backend",
    endpoints: [
      `http://localhost:${listeningPort}/api/notify/email`,
      `http://localhost:${listeningPort}/api/notify/sms`,
      `http://localhost:${listeningPort}/api/coins`,
      `http://localhost:${listeningPort}/api/alerts`,
      `http://localhost:${listeningPort}/api/prices/live`
    ],
  });
});

app.post("/api/notify/email", async (req, res) => {
  const { to, subject, text, html } = req.body;
  const mailResponse = await Notifier.sendEmail({ to, subject, text, html });

  if (mailResponse.ok) {
    res.status(200).json({ success: true, status: mailResponse.status });
  } else {
    res.status(mailResponse.status || 500).json({ success: false, error: mailResponse.error });
  }
});

app.post("/api/notify/sms", async (req, res) => {
  const { to, message } = req.body;
  const smsResponse = await Notifier.sendSMS({ to, message });

  if (smsResponse.ok) {
    res.status(200).json({ success: true, sid: smsResponse.sid });
  } else {
    res.status(smsResponse.status || 500).json({ success: false, error: smsResponse.error });
  }
});

app.get("/api/coins", async (req, res) => {
  const coins = await fetchTopCoins();
  res.json(coins);
});

app.post("/api/alerts", async (req, res) => {
  const id = await saveAlert(req.body);
  res.json({ id });
});

app.get("/api/alerts", async (req, res) => {
  const alerts = await getAlerts();
  res.json(alerts);
});

let latestPrices = {};

startPriceStream(async (updates) => {
  latestPrices = updates; 

  const alerts = await getAlerts();
  for (const alert of alerts) {
    const price = updates[alert.coinId];
    if (!price) continue;

    const triggered =
      (alert.direction === "ABOVE" && price > alert.targetPrice) ||
      (alert.direction === "BELOW" && price < alert.targetPrice);

    if (triggered && !alert.triggered) {
      await updateAlert(alert._id, { triggered: true });

      const subject = "Crypto Alert Triggered";
      const text = `Your alert for ${alert.coinId} was triggered at ${price}`;
      const html = `<p>${text}</p>`;

      if (alert.email) {
        try {
          const res = await Notifier.sendEmail({ to: alert.email, subject, text, html });
          console.log("Email result:", res.status, res.error || "OK");
        } catch (err) {
          console.error("❌ Email send failed:", err.message);
        }
      }

      if (alert.phoneNumber) {
        try {
          const res = await Notifier.sendSMS({
            to: alert.phoneNumber,
            message: `Crypto Alert: ${alert.coinId} hit ${price}`,
          });
          console.log("SMS result:", res.status, res.error || "OK");
        } catch (err) {
          console.error("❌ SMS send failed:", err.message);
        }
      }
    }
  }
});

app.get("/api/prices/live", (req, res) => {
  res.json(latestPrices);
});

app.listen(listeningPort, () => {
  console.log(`🚀 Crypto Alert backend ready at http://localhost:${listeningPort}`);
});

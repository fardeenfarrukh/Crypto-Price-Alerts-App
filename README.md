# Crypto Price Alert Service – Real‑Time Notifications via Email & SMS

A modern full‑stack web application that allows users to set cryptocurrency price alerts and receive notifications instantly via **Email (SendGrid)** or **SMS (Twilio)**. The app streams live market data from **Binance WebSocket** and uses **CoinGecko** for coin metadata. Alerts are stored in **MongoDB** and dispatched reliably with one‑time trigger logic.

---

## ✨ Key Features

* **Real‑Time Price Monitoring**: Live updates from Binance WebSocket for BTC, ETH, BNB, and USDT.
* **Custom Alerts**: Users can set thresholds (ABOVE/BELOW) for target prices.
* **Email Notifications**: Integrated with SendGrid for fast, reliable delivery.
* **SMS Notifications**: Integrated with Twilio for instant text alerts.
* **MongoDB Persistence**: Alerts stored securely with triggered state tracking.
* **Coin Metadata**: CoinGecko integration for names, logos, and sparkline data.
* **Frontend Dashboard**: Market list, live chart, alert status, and notification log.
* **One‑Time Trigger Logic**: Prevents repeated spam by marking alerts as triggered.
* **Responsive UI**: Built with React + Vite + Tailwind CSS for desktop and mobile.

---

## 🚀 Tech Stack

* **Frontend**: React, Vite, Tailwind CSS  
* **Backend**: Node.js, Express  
* **Database**: MongoDB (Mongoose)  
* **Notifications**: SendGrid (Email), Twilio (SMS)  
* **Market Data**: Binance WebSocket, CoinGecko API  
* **Local Development**: Node.js, npm  

---

## 🛠️ Local Setup & Installation

Follow these steps to run the project locally.

### Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node.js)
- MongoDB running locally or via a cloud provider (e.g. Atlas)
- SendGrid account with verified sender email
- Twilio account (trial or paid)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/crypto-price-alert-service.git
cd crypto-price-alert-service
```         

### 2. Backend Setup

Navigate into the backend folder and install dependencies:

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory with the following configuration:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/crypto-alerts

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_MESSAGING_SERVICE_SID=your_service_sid

# CoinGecko (optional, only for paid plan)
COINGECKO_API_KEY=your_api_key
```

### 4. Run the Backend

Start the backend server:

```bash
npm run dev
```

### 5. Frontend Setup

Navigate into the frontend folder and install dependencies:

```bash
cd frontend
npm install
npm run dev
```
---

## 🔔 Usage

1. Open the frontend at `http://localhost:5173`.
2. Browse **Market List** and **Price Chart** to view live cryptocurrency data.
3. Open **Alert Form** to register a new alert:
   - Select a coin (BTC, ETH, BNB, USDT).
   - Set a target price and direction (ABOVE/BELOW).
   - Provide an email address and/or phone number.
4. When the live price crosses your threshold:
   - An **Email** is sent via SendGrid.
   - An **SMS** is sent via Twilio.
   - The alert is marked as `triggered` in MongoDB to prevent duplicate notifications.

---

## ⚠️ Notes

- **Twilio trial accounts**: limited to 50 SMS/day, only to verified numbers.
- **SendGrid**: sender email must be verified before sending.
- **CoinGecko free tier**: limited API calls; backend caches results to avoid hitting rate limits.
- Alerts fire **once** per condition; reset or delete alerts to re‑use.

---

## 🙌 Acknowledgements

- [Binance WebSocket API](https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams) – for live market data  
- [CoinGecko API](https://www.coingecko.com/en/api) – for coin metadata and sparkline data  
- [SendGrid](https://sendgrid.com/) – for email notifications  
- [Twilio](https://www.twilio.com/) – for SMS notifications  

---

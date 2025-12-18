// backend/services/Notifier.js
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const Notifier = {
  async sendEmail({ to, subject, text, html }) {
    try {
      const msg = {
        to,
        from: process.env.SENDGRID_FROM_EMAIL, 
        subject,
        text,
        html,
      };

      const [res] = await sgMail.send(msg);

      console.log("SendGrid response:", res.statusCode);
      return { ok: true, status: res.statusCode };
    } catch (err) {
      console.error(
        "SendGrid error:",
        err.response?.statusCode,
        err.response?.body || err.message
      );
      return {
        ok: false,
        status: err.response?.statusCode || 500,
        error: err.response?.body || err.message,
      };
    }
  },

  async sendSMS({ to, message }) {
    try {
      const auth = Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString("base64");

      const formData = new URLSearchParams();
      formData.append("To", to);

      if (process.env.TWILIO_MESSAGING_SERVICE_SID) {
        formData.append("MessagingServiceSid", process.env.TWILIO_MESSAGING_SERVICE_SID);
      } else {
        formData.append("From", process.env.TWILIO_PHONE_NUMBER);
      }

      formData.append("Body", message);

      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error("Twilio error:", res.status, data);
        return { ok: false, status: res.status, error: data };
      }

      console.log("Twilio SMS sent:", data.sid);
      return { ok: true, sid: data.sid };
    } catch (err) {
      console.error("Twilio exception:", err.message);
      return { ok: false, error: err.message };
    }
  },
};

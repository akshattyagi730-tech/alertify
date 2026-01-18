
import TrustedContact from "../models/TrustedContact.js";
import { sendSMS } from "../services/smsService.js";

export const startSOS = async (req, res) => {
  try {
    console.log("SOS BODY:", req.body);

    const contacts = await TrustedContact.find({
      created_by: req.body.created_by
    });

    const numbers = contacts.map(c => c.phone);

    console.log("CONTACT NUMBERS:", numbers);

    const smsResult = await sendSMS({
      numbers,
      message: `🚨 SOS ALERT 🚨
User needs help!
Location: https://maps.google.com/?q=${req.body.latitude},${req.body.longitude}`
    });

    return res.json({
      success: true,
      alert: req.body,
      sms: smsResult
    });

  } catch (err) {
    console.error("SOS ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to start SOS" });
  }
};

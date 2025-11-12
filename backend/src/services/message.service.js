// ✅ message.service.js (CommonJS version)
const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      body: message,
    });
    console.log("✅ SMS sent successfully");
  } catch (error) {
    console.error("❌ Error in sending SMS ->", error);
  }
};

module.exports = { sendSMS };

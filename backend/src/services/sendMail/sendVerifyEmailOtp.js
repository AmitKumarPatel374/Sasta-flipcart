import axios from "axios"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

const APP_NAME = "ShopMaster"
const LOGO_URL = "https://ik.imagekit.io/amit374/n23/myLogo.png?updatedAt=1762869433221"

export async function sendVerifyEmailOtp({
  email,
  username,
  otp,
  otpExpiry
}) {
  try {
    const expiryMinutes = Math.max(
      1,
      Math.floor((new Date(otpExpiry).getTime() - Date.now()) / 60000)
    )

    const payload = {
      sender: {
        name: APP_NAME,
        email: process.env.EMAIL,
      },
      to: [{ email }],
      subject: `Verify your email | ${APP_NAME}`,
      htmlContent: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f7fa;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:10px;box-shadow:0 4px 10px rgba(0,0,0,0.05);overflow:hidden;">

    <!-- Header -->
    <div style="background:linear-gradient(90deg,#3b82f6,#06b6d4);padding:20px;text-align:center;">
      <img 
        src="${LOGO_URL}" 
        alt="${APP_NAME} Logo" 
        style="width:80px;height:80px;border-radius:50%;margin-bottom:10px;background:white;padding:5px;box-shadow:0 0 8px rgba(0,0,0,0.1);" 
      />
      <h2 style="color:white;font-size:22px;font-weight:600;margin:0;">
        ${APP_NAME}
      </h2>
    </div>

    <!-- Content -->
    <div style="padding:30px;color:#333333;">
      <h1 style="font-size:20px;margin-bottom:10px;">
        Hello ${username},
      </h1>

      <p style="line-height:1.6;margin-bottom:20px;">
        Use the one-time verification code below to verify your email address. 
        This code will expire in <strong>${expiryMinutes} minutes</strong>.
      </p>

      <div style="text-align:center;">
        <div style="
          display:inline-block;
          background-color:#f1f5f9;
          border-radius:8px;
          padding:14px 22px;
          font-size:26px;
          letter-spacing:6px;
          font-weight:bold;
          color:#0f172a;
          text-align:center;
          margin:10px 0;
        ">
          ${otp}
        </div>
      </div>

      <p style="margin-top:20px;">
        If you did not request this verification, please ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="font-size:13px;color:#777;text-align:center;padding:20px;background-color:#f9fafb;">
      © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
    </div>

  </div>
</body>
</html>
      `,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log(`${APP_NAME} VERIFY EMAIL OTP SENT:`, response.data.messageId)
    return response.data
  } catch (error) {
    console.error(
      `${APP_NAME} Verify email OTP failed:`,
      error.response?.data || error.message
    )
    throw error
  }
}

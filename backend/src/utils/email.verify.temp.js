const otpVerifyTemp = (username, otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification Code</title>
    <style>
      body {
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: #f5f7fa;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(90deg, #3b82f6, #06b6d4);
        padding: 20px;
        text-align: center;
      }
      .header img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-bottom: 10px;
        background: white;
        padding: 5px;
        box-shadow: 0 0 8px rgba(0,0,0,0.1);
      }
      .header h2 {
        color: white;
        font-size: 22px;
        font-weight: 600;
        margin: 0;
      }
      .content {
        padding: 30px;
        color: #333333;
      }
      .content h1 {
        font-size: 20px;
        margin-bottom: 10px;
      }
      .content p {
        line-height: 1.6;
        margin-bottom: 20px;
      }
      .otp-box {
        display: inline-block;
        background-color: #f1f5f9;
        border-radius: 8px;
        padding: 14px 22px;
        font-size: 26px;
        letter-spacing: 6px;
        font-weight: bold;
        color: #0f172a;
        text-align: center;
        margin: 10px 0;
      }
      .footer {
        font-size: 13px;
        color: #777;
        text-align: center;
        padding: 20px;
        background-color: #f9fafb;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <!-- ✅ Put your logo image here -->
        <img src="https://ik.imagekit.io/amit374/n23/myLogo.png?updatedAt=1762869433221" alt="App Logo" />
        <h2>ShopMaster</h2>
      </div>
      <div class="content">
        <h1>Hello ${username},</h1>
        <p>Use the one-time verification code below to verify your email address. This code will expire in 10 minutes.</p>
        <div style="text-align:center;">
          <div class="otp-box">${otp}</div>
        </div>
        <p>If you did not request this verification, please ignore this email.</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} YourApp. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `
}

module.exports = otpVerifyTemp;

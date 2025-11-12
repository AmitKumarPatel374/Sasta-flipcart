const resePassTemp = (username, resetLink) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset Request</title>
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
        background: linear-gradient(90deg, #0ea5a4, #06b6d4);
        padding: 25px 20px;
        text-align: center;
      }
      /* ✅ Show logo fully, no border radius or crop */
      .header img {
        width: 150px;
        height: auto;
        margin-bottom: 12px;
        display: block;
        margin-left: auto;
        margin-right: auto;
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
      .btn {
        display: inline-block;
        background-color: #0ea5a4;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: 600;
        transition: background-color 0.3s;
      }
      .btn:hover {
        background-color: #0891b2;
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
        <!-- ✅ Full logo shown directly -->
        <img src="https://ik.imagekit.io/amit374/n23/myLogo.png?updatedAt=1762869433221" alt="ShopMaster Logo" />
        <h2>ShopMaster</h2>
      </div>
      <div class="content">
        <h1>Hello ${username},</h1>
        <p>We received a request to reset your password. Click the button below to set up a new password.</p>
        <p style="text-align:center;">
          <a href="${resetLink}" class="btn" target="_blank">Reset Password</a>
        </p>
        <p>If you didn’t request this, you can safely ignore this email. The link will expire in 5 minutes for security reasons.</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} ShopMaster. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

module.exports = resePassTemp;

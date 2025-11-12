# Gmail Production Setup Guide

## 🔑 Why Gmail App Password is Required

Gmail blocks regular passwords for SMTP in production environments for security. You **must** use a Gmail App Password instead.

## 📋 Step-by-Step Setup

### Step 1: Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click **2-Step Verification**
3. Follow the prompts to enable it (you'll need your phone)

### Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - If you don't see this option, make sure 2-Step Verification is enabled
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter a name like "Production Server" or "Password Reset Service"
5. Click **Generate**
6. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Set Environment Variables

In your production environment, set these variables:

```env
EMAIL=your-email@gmail.com
EMAIL_PASS=abcdefghijklmnop  # The 16-character App Password (no spaces)
EMAIL_HOST=smtp.gmail.com     # Optional, defaults to smtp.gmail.com
EMAIL_PORT=587                # Optional, defaults to 587
```

**Important Notes:**
- Use the **App Password**, NOT your regular Gmail password
- Remove spaces from the App Password when setting it
- The App Password is 16 characters without spaces

### Step 4: Verify Configuration

After deploying, check your server logs. You should see:
- ✅ `Email transporter is ready to send emails`
- ✅ `Email sent successfully` when testing

## 🐛 Common Issues & Solutions

### Issue: "EAUTH" or "Authentication failed"

**Solution:*
- Make sure you're using an App Password, not your regular password
- Verify 2-Step Verification is enabled
- Check that the App Password doesn't have spaces
- Generate a new App Password if needed

### Issue: "ETIMEDOUT" or "ECONNREFUSED"

**Solution:**
- Check if port 587 is open in your production environment
- Some hosting providers (like Railway, Render) may block SMTP ports
- Contact your hosting provider to unblock port 587
- Alternative: Use a service like SendGrid, Mailgun, or AWS SES

### Issue: "535 Authentication failed"

**Solution:**
- Verify your App Password is correct
- Make sure 2-Step Verification is enabled
- Try generating a new App Password

## 🔄 Alternative: Use Email Service Providers

If Gmail continues to cause issues, consider using dedicated email services:

### Option 1: SendGrid (Recommended)
- Free tier: 100 emails/day
- More reliable for production
- Better deliverability

### Option 2: Mailgun
- Free tier: 5,000 emails/month
- Easy setup
- Good for transactional emails

### Option 3: AWS SES
- Very cheap ($0.10 per 1,000 emails)
- Requires AWS account
- Best for high volume

## ✅ Testing

After setup, test the password reset:

1. Go to your production site
2. Click "Forgot Password"
3. Enter your email
4. Check your email inbox
5. Check server logs for any errors

## 📝 Environment Variables Checklist

Make sure these are set in production:

- [ ] `NODE_ENV=production`
- [ ] `EMAIL=your-email@gmail.com`
- [ ] `EMAIL_PASS=your-16-char-app-password`
- [ ] `SERVER_ORIGIN=https://your-api-domain.com` (for reset links)
- [ ] `JWT_RAW_SECRET=your-secret` (for reset tokens)

## 🚨 Security Notes

1. **Never commit App Passwords to Git** - Always use environment variables
2. **Rotate App Passwords regularly** - Generate new ones every few months
3. **Use different App Passwords** - One for development, one for production
4. **Monitor email sending** - Check logs regularly for failed attempts

---

**Need Help?** Check your server logs - the updated mail service now provides detailed error messages to help diagnose issues.


# Production Deployment Guide - Authentication & Performance Fixes

This guide addresses the common issues when deploying a React + Node/Express application from localhost to production, specifically focusing on authentication token issues and performance optimization.

## 🔍 Common Issues Identified

### 1. **Token Not Received After Login**
- **Cause**: Cookie settings not configured for HTTPS/production
- **Symptoms**: Login succeeds but frontend can't access token
- **Fix**: Updated cookie settings with `secure: true` and `sameSite: 'None'` for production

### 2. **Slow Login Performance**
- **Cause**: Missing connection pooling, inefficient queries, network latency
- **Symptoms**: Login takes 5-10+ seconds in production
- **Fix**: Added MongoDB connection pooling, Redis optimization, query improvements

---

## 📋 Pre-Deployment Checklist

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with these variables:

```env
# Environment
NODE_ENV=production

# Server
PORT=5000

# Client Origin (comma-separated for multiple domains)
CLIENT_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Cookie Domain (only if using subdomains)
# COOKIE_DOMAIN=.yourdomain.com

# JWT Secrets (generate strong secrets!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_RAW_SECRET=your-raw-secret-for-password-reset
SESSION_SECRET=your-session-secret

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Redis (optional but recommended)
REDIS_URL=redis://:password@host:port
# OR
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://your-api-domain.com/api/auth/google/callback

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Password Reset
RESET_PASSWORD_BASE_URL=https://yourdomain.com
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_SERVER_URL=https://your-api-domain.com/api
```

**Important**: After changing `.env`, rebuild your frontend:
```bash
npm run build
```

---

## 🔧 Key Fixes Applied

### 1. Cookie Configuration

**Problem**: Cookies weren't being set in production due to:
- `secure: false` (cookies blocked on HTTPS)
- `sameSite: 'Lax'` (doesn't work for cross-origin in production)

**Solution**: Dynamic cookie settings based on environment:

```javascript
// backend/src/utils/cookie.utils.js
const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProduction, // true in production (HTTPS required)
        sameSite: isProduction ? 'None' : 'Lax',
        maxAge: 60 * 60 * 1000, // 1 hour
        domain: process.env.COOKIE_DOMAIN || undefined,
    };
};
```

### 2. CORS Configuration

**Problem**: CORS wasn't properly handling production origins

**Solution**: Dynamic origin handling with multiple origins support:

```javascript
// backend/server.js
const allowedOrigins = process.env.CLIENT_ORIGIN 
  ? process.env.CLIENT_ORIGIN.split(',').map(origin => origin.trim())
  : ["http://localhost:5173"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    // ... other options
}));
```

### 3. Database Connection Pooling

**Problem**: No connection pooling, causing slow queries

**Solution**: Added MongoDB connection options:

```javascript
// backend/src/config/database/db.js
const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    retryReads: true,
};
```

### 4. Redis Optimization

**Problem**: Redis connection not optimized for production

**Solution**: Added retry strategy and connection pooling:

```javascript
// backend/src/services/cache.service.js
const redisConfig = {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 50, 2000),
    enableOfflineQueue: false,
    connectTimeout: 10000,
    commandTimeout: 5000,
};
```

---

## 🐛 Debugging Guide

### Check if Token is Being Set

1. **Backend Logs**: Check server logs for:
   ```
   token generated: ✓
   Environment: production
   Cookie secure: true (HTTPS)
   ```

2. **Browser DevTools**:
   - Open DevTools → Application → Cookies
   - Look for `token` cookie
   - Check if it has:
     - ✅ `HttpOnly` flag
     - ✅ `Secure` flag (in production)
     - ✅ `SameSite=None` (in production)

3. **Network Tab**:
   - Go to Network → Login request
   - Check Response Headers for `Set-Cookie`
   - Should see: `Set-Cookie: token=...; HttpOnly; Secure; SameSite=None`

### Check CORS Issues

1. **Browser Console**: Look for CORS errors:
   ```
   Access to XMLHttpRequest blocked by CORS policy
   ```

2. **Backend Logs**: Check if origin is being rejected

3. **Verify Environment Variable**:
   ```bash
   echo $CLIENT_ORIGIN  # Should match your frontend URL exactly
   ```

### Check API Endpoint

1. **Frontend Console**: Check logs:
   ```
   Login attempt - API URL: https://your-api.com/api
   ```

2. **Network Tab**: Verify request is going to correct URL

3. **Test API Directly**:
   ```bash
   curl -X POST https://your-api.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test"}'
   ```

### Performance Debugging

1. **Check Database Connection**:
   - Look for: `✅ MongoDB Connected successfully`
   - Check connection pool size in logs

2. **Check Redis Connection**:
   - Look for: `✅ Redis connected successfully`
   - Monitor Redis response times

3. **Network Latency**:
   - Use browser DevTools → Network → Timing
   - Check `TTFB` (Time To First Byte)
   - Should be < 500ms for good performance

---

## 🚀 Deployment Steps

### Backend Deployment (Example: Railway/Render/Vercel)

1. **Set Environment Variables** in your hosting platform
2. **Ensure HTTPS is enabled** (required for secure cookies)
3. **Deploy**:
   ```bash
   git push origin main
   ```

### Frontend Deployment (Example: Vercel/Netlify)

1. **Set Environment Variables**:
   - `VITE_SERVER_URL=https://your-api.com/api`

2. **Build**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   # or
   netlify deploy --prod
   ```

---

## ⚠️ Important Notes

### Cookie SameSite='None' Requirements

When using `sameSite='None'`, you MUST:
1. Set `secure: true` (HTTPS required)
2. Ensure frontend and backend are on HTTPS
3. If using different domains, configure CORS properly

### Domain Configuration

- **Same Domain**: No `COOKIE_DOMAIN` needed
  - Frontend: `https://app.example.com`
  - Backend: `https://api.example.com`
  - Cookie works automatically

- **Subdomains**: Set `COOKIE_DOMAIN=.example.com`
  - Frontend: `https://app.example.com`
  - Backend: `https://api.example.com`
  - Cookie shared across subdomains

- **Different Domains**: Use `sameSite: 'None'` and `secure: true`
  - Frontend: `https://example.com`
  - Backend: `https://api.otherdomain.com`
  - Requires proper CORS setup

---

## 📊 Performance Optimization Tips

1. **Database Indexing**: Ensure indexes on frequently queried fields:
   ```javascript
   // In your models
   userSchema.index({ email: 1 });
   ```

2. **Query Optimization**: Use `.select()` to limit fields:
   ```javascript
   UserModel.findById(id).select('-password');
   ```

3. **Caching**: Use Redis for:
   - Session tokens
   - Frequently accessed data
   - Rate limiting

4. **Connection Pooling**: Already configured in `db.js`

5. **CDN**: Use CDN for static assets

6. **Compression**: Enable gzip compression in your server

---

## 🔐 Security Checklist

- [ ] All secrets are in environment variables (not hardcoded)
- [ ] `JWT_SECRET` is at least 32 characters, randomly generated
- [ ] `SESSION_SECRET` is different from `JWT_SECRET`
- [ ] HTTPS is enabled in production
- [ ] CORS is restricted to known origins in production
- [ ] Cookies are `httpOnly` and `secure` in production
- [ ] Database credentials are secure
- [ ] Redis password is set (if using)

---

## 📞 Troubleshooting

### Issue: "Token not found" after login

**Possible Causes**:
1. Cookie not being set (check `Set-Cookie` header)
2. Cookie being blocked by browser (check DevTools → Application → Cookies)
3. CORS not allowing credentials
4. `secure` flag mismatch (HTTPS required if `secure: true`)

**Solution**:
- Check browser console for errors
- Verify `withCredentials: true` in frontend
- Verify CORS `credentials: true` in backend
- Check cookie settings match environment

### Issue: Slow login (5-10+ seconds)

**Possible Causes**:
1. Database connection issues
2. Redis connection timeout
3. Network latency
4. Missing indexes on database

**Solution**:
- Check database connection logs
- Monitor Redis response times
- Add database indexes
- Use connection pooling (already configured)

### Issue: CORS errors in production

**Possible Causes**:
1. Origin not in `CLIENT_ORIGIN` environment variable
2. Missing `credentials: true` in CORS config
3. Preflight request failing

**Solution**:
- Verify `CLIENT_ORIGIN` includes exact frontend URL
- Check CORS configuration
- Ensure `OPTIONS` method is allowed

---

## 📝 Sample Configuration Files

See `.env.example` files in:
- `backend/.env.example`
- `frontend/.env.example`

Copy these to `.env` and fill in your values.

---

## ✅ Verification Steps

After deployment, verify:

1. **Login Works**:
   - [ ] Can log in successfully
   - [ ] Token cookie is set (check DevTools)
   - [ ] Can access protected routes

2. **Performance**:
   - [ ] Login completes in < 2 seconds
   - [ ] API responses are fast
   - [ ] No timeout errors

3. **Security**:
   - [ ] Cookies are `httpOnly` and `secure`
   - [ ] CORS is properly configured
   - [ ] HTTPS is enabled

---

## 🎯 Quick Reference

### Backend Cookie Settings
```javascript
// Development
secure: false
sameSite: 'Lax'

// Production
secure: true
sameSite: 'None'
```

### Frontend API Configuration
```javascript
// apiInstance.js
baseURL: import.meta.env.VITE_SERVER_URL
withCredentials: true  // Required for cookies
```

### Environment Variables
```bash
# Backend
NODE_ENV=production
CLIENT_ORIGIN=https://yourdomain.com
JWT_SECRET=your-secret

# Frontend
VITE_SERVER_URL=https://your-api.com/api
```

---

**Need Help?** Check the debugging section above or review the console logs for specific error messages.


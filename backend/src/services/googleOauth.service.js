const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;

const isProduction = process.env.NODE_ENV === "production";

// Use different callback URLs for local and deployed versions
const CALLBACK_URL = isProduction
  ? "https://sasta-flipcart.onrender.com/api/auth/google/callback"
  : "http://localhost:3000/api/auth/google/callback";


passport.use(
    new googleStrategy(
        {
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:CALLBACK_URL
        },
        async(accessToken,refreshToken,profile,done)=>{
            try {
                console.log("googleprofile", profile);
                return done(null,profile);
            } catch (error) {
                console.log("error in google login", error);
                return done(error,null);
            }
        }
    )
)

passport.serializeUser((user,done)=>done(null,user));
passport.deserializeUser((user,done)=>done(null,user));
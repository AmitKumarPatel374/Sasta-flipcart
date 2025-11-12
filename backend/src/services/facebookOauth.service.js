const passport = require("passport");
const facebookStrategy = require("passport-facebook").Strategy;


passport.use(
    new facebookStrategy(
        {
            clientID:process.env.FACEBOOK_CLIENT_ID,
            clientSecret:process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL:process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ["id", "displayName", "photos", "email"],
        },
        async(accessToken,refreshToken,profile,done)=>{
            try {
                console.log("facebook profile ->", profile);
                return done(null,profile);
            } catch (error) {
                console.log("error in facebook login", error);
                return done(error,null);
            }
        }
    )
)

passport.serializeUser((user,done)=>done(null,user));
passport.deserializeUser((user,done)=>done(null,user));
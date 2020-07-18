const passport =require("passport");
const googleStrategy=require("passport-google-oauth").OAuth2Strategy;
const User=require("../models/users");


passport.serializeUser((user, done)=>{
    done(null , user.id);
})

passport.deserializeUser((id, done)=>{
    User.findById(id , (err,user)=>{
        done(err,user);
    })
})

passport.use(new googleStrategy({
    clientID:config.service.GOOGLE.CLIENT_ID,
    clientSecret:config.service.GOOGLE.CLIENT_SECRET,
    callbackURL:config.service.GOOGLE.CALLBACK_URL
} ,
function (accessToken,refreshToken,profile, done){
    User.findOne({'email' : profile.emails[0].value} , (err , user)=>{
        if(err) return done(err)
        if(user) return done(null , user);
        const adduser = new User({
            name : profile.displayName,
            email:profile.emails[0].value,
            password:profile.id
        })

        adduser.save(err => {
            if(err) console.log(err);
            done(null , adduser);
        })
    })
}))
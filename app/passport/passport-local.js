const passport =require("passport");
const localStrategy=require("passport-local").Strategy;
const User=require("./../models/users");


passport.serializeUser((user, done)=>{
    done(null , user.id);
})

passport.deserializeUser((id, done)=>{
    User.findById(id , (err,user)=>{
        done(err,user);
    })
})

passport.use('local.register' , new localStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
} , (req, email, password, done)=>{
    User.findOne({'email' : email} , (err , user)=>{
        if(err) return done(err)
        if(user) return done(null , false , req.flash('errors' , 'قبلا کاربری با این مشخضات در سیستم ثبت نام کرده است'));
        const adduser = new User({
            name : req.body.name,
            email,
            password
        })

        //console.log(adduser);
        adduser.save(err => {
            if(err) return done(err , false , req.flash('errors' , 'امکان ثبت نام در حال حاضر وجود ندارد مجددا تلاش نمایید!'));
            done(null , adduser);
        })
    })
}))


passport.use('local.login' , new localStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
} , (req, email, password, done)=>{
    User.findOne({'email' : email} , (err , user)=>{
        if(err) return done(err)
        if(!user || !user.comparePassword(password)) return done(null , false , req.flash('errors' , 'کاربری با این مشخصات وجود ندارد'));
        done(null , user);
    })
}))

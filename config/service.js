module.exports={

    RECAPTCHA:{
        SITE_KEY:process.env.RECAPTCHA_SITEKEY,
        SECRET_KEY:process.env.RECAPTCHA_SECRETKEY,
        OPTION:{
            h1:"fa"
        }
    },

    GOOGLE:{
        CLIENT_ID:process.env.GOOGLE_CLIENTID,
        CLIENT_SECRET:process.env.GOOGLE_CLIENTSECRET,
        CALLBACK_URL:"http://localhost:3000/auth/google/callback"
    }
}
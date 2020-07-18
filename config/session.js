const mongoose=require("mongoose");
const session=require("express-session");
const MongoStore=require("connect-mongo")(session);


module.exports={
    secret:"secretID",
    resave:true,
    saveUninitialized:true,
    //secure:false,
    store:new MongoStore({mongooseConnection:mongoose.connection})
            
}
const express=require("express");
const http=require("http");
const path =require("path");
const mongoose=require("mongoose");
const expressLayouts=require("express-ejs-layouts");
const bodyParser=require("body-parser");
const session=require("express-session");
const MongoStore=require("connect-mongo")(session);
const cookieParser=require("cookie-parser");
const flash=require("connect-flash");
const passport=require("passport");
const rememberLogin=require("app/http/middleware/rememberLogin")
const methodOverride=require("method-override");
const Helper=require("./helper");
const access=require("app/accessUser");
const socketIo=require("socket.io");
const chatController=require("app/http/controller/chat/chatController");


const app=express();
 
module.exports=class Application{
  
    constructor(){
        
        this.configServer();
        this.configDatabase();
        this.setConfig();
        this.setRoutes();
    }

    configServer(){
        const server=http.createServer(app);
        const io=socketIo(server);

        chatController.connectToSocket(io);
        server.listen(3000,console.log("server run on port 3000 ..."));
    }

    configDatabase(){
        mongoose.Promise=global.Promise;
        mongoose.connect(config.database.url,{useNewUrlParser: true  , useUnifiedTopology: true});
    }

    setConfig(){
        require("./passport/passport-local");
        require("./passport/passport-google");
        app.use(express.static(config.layout.PUBLIC_DIR));
        app.set("view engine",config.layout.VIEW_ENGINE);
        app.set("views",config.layout.VIEW_DIR);
        app.use(config.layout.EJS.expressLayouts);
        app.set("layout",config.layout.EJS.master);
        app.set("layout extractScripts",config.layout.EJS.extractScripts);
        app.set("layout extractStyles",config.layout.EJS.extractStyles);
        app.set(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:true}));
        app.use(session({...config.session}));
        app.use(cookieParser("secretID"));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(rememberLogin.handle);
        app.use((req,res,next)=>{
            app.locals=new Helper(req,res).object();
            next();
        })

        app.use(methodOverride("_method"));
        app.use(access.middleware());
    }
    setRoutes(){
        app.use(require("./routes/web"));
       // app.use(require("./routes/api"));
        app.all("*",(req,res,next)=>{
            res.json("چنین صفحه ای وجود ندارد");
        })
    }
}
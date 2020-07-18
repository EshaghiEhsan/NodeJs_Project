const path=require("path");
const expressLayouts=require("express-ejs-layouts");

module.exports={
    PUBLIC_DIR:"./public",
    VIEW_ENGINE:"ejs",
    VIEW_DIR:path.resolve("./resources/views"),
    EJS:{
        expressLayouts,
        master:"master",
        extractScripts:true,
        extractStyles:true
    }
}
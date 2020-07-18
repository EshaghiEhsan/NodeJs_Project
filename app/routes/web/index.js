const express=require("express");
const router=express.Router();

const authRouters=require("./auth");
const homeRoutes=require("./home");
const adminRoutes=require("./admin");

// middleware
const redirectAuthenticated=require("app/http/middleware/redirectAuthenticated");
const redirectIfNotAuthenticated=require("app/http/middleware/redirectifNotAuthenticated");
const checkError=require("app/http/middleware/checkError");

// auth Routes
router.use("/auth",redirectAuthenticated.handle,authRouters);

// homeRoutes
router.use("/",homeRoutes);

// adminPanel
router.use("/admin",redirectIfNotAuthenticated.handle,adminRoutes);

//Error routes
router.all("*",checkError.get404);
router.use(checkError.handle);


module.exports=router;
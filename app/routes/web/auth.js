const express=require("express");
const router=express.Router();
const passport=require("passport");

//controller
const registerController=require("../../http/controller/auth/registerController");
const loginController=require("../../http/controller/auth/loginController");
const forgetPasswordController=require("../../http/controller/auth/forgetPasswordController");
const resetPasswordController=require("../../http/controller/auth/resetPasswordController");

// validator
const registerValidator=require("../../http/validators/registerValidator");
const loginValidator=require("../../http/validators/loginValidator");
const forgetpasswordValidator=require("../../http/validators/forgetpasswordValidator");
const resetPasswordValidator=require("../../http/validators/resetPasswordValidator");

router.get('/register',registerController.showForm);
router.post('/register',registerValidator.handle(),registerController.registerProcess);

router.get('/login',loginController.showForm);
router.post('/login',loginValidator.handle(),loginController.loginProcess);

//api
router.get('/google',passport.authenticate("google",{ scope:["email","profile"]}));
router.get('/google/callback',passport.authenticate("google",{successRedirect:"/",failureRedirect:"/auth/login"}));

//password reset
router.get("/password/reset",forgetPasswordController.showForm);
router.post("/password/email",forgetpasswordValidator.handle(),forgetPasswordController.resetLinkProcess);
router.get("/password/reset/:token",resetPasswordController.showForm);
router.post("/password/reset",resetPasswordValidator.handle(),resetPasswordController.resetPasswordProcess);



module.exports=router;
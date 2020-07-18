const express=require("express");
const router=express.Router();
//const multer= require("multer");
const upload=require("../../../app/uploadImages");

router.use((req,res,next)=>{
    res.locals.layout="admin/master";
    next();
})

// controller 
const adminController=require("app/http/controller/adminController");

const courseController=require("../../http/controller/course/courseController");
const courseValidator=require("../../http/validators/courseValidator");

const episodeController=require("../../http/controller/episode/episodeController");
const episodeValidator=require("../../http/validators/episodeValidator");

const categoryController=require("../../http/controller/category/categoryController");
const categoryValidator=require("../../http/validators/categoryValidator");

const commentController=require("./../../http/controller/comment/commentController");

const articleController=require("./../../http/controller/article/articleController");
const articleValidator=require("../../http/validators/articleValidator");

const profileController=require("../../http/controller/profile/profileController");

const permissionController=require("../../http/controller/permission/permissionController");
const permissionValidator=require("../../http/validators/permissionValidator");

const roleController=require("../../http/controller/role/roleController");
const roleValidator=require("../../http/validators/roleValidator");

const userController=require("../../http/controller/user/userController");
const userValidator=require("../../http/validators/registerValidator");

//chat
const chatController=require("../../http/controller/chat/chatController");


const access=require("app/accessUser");

//middleware
const fileToField=require("../../http/middleware/fileToField");

router.get("/",adminController.index);
router.get("/course",courseController.index);
router.get("/course/create",courseController.create);
router.post("/course/create",upload.single("images"),fileToField.handle, courseValidator.handle(),courseController.store);

//delete course
router.delete("/course/:id",courseController.destroy);

//edit Course 
router.get("/course/:id/edit",courseController.edit);
router.put("/course/:id",upload.single("images"),fileToField.handle,courseValidator.handle(),courseController.update);

// episode router


router.get("/episode",episodeController.index);
router.get("/episode/create",episodeController.create);
router.post("/episode/create",episodeValidator.handle(),episodeController.store);

//delete course
router.delete("/episode/:id",episodeController.destroy);

//edit Course 
router.get("/episode/:id/edit",episodeController.edit);
router.put("/episode/:id",episodeValidator.handle(),episodeController.update);

router.get("/comment",commentController.index);
router.delete("/comment/:id",commentController.destroy);
router.put("/comment/:id/approve",commentController.update);

// route of article
router.get("/",adminController.index);
router.get("/article",articleController.index);
router.get("/article/create",articleController.create);
router.post("/article/create",upload.single("images"),fileToField.handle, articleValidator.handle(),articleController.store);

//delete article
router.delete("/article/:id",articleController.destroy);

//edit article 
router.get("/article/:id/edit",articleController.edit);
router.put("/article/:id",upload.single("images"),fileToField.handle,articleValidator.handle(),articleController.update);

//category
router.get("/category",categoryController.index);
router.get("/category/create",categoryController.create);
router.post("/category/create",categoryValidator.handle(),categoryController.store);

//delete course
router.delete("/category/:id",categoryController.destroy);

//edit Course
router.get("/category/:id/edit",categoryController.edit);
router.put("/category/:id",categoryValidator.handle(),categoryController.update);

//profile
router.get("/profile",profileController.index);
router.put("/profile/:id",profileController.updateProfile);


//permission
router.get("/permission",permissionController.index);
router.get("/permission/create",permissionController.create);
router.post("/permission/create",permissionValidator.handle(),permissionController.store);

//delete course
router.delete("/permission/:id",permissionController.destroy);

//edit Course
router.get("/permission/:id/edit",permissionController.edit);
router.put("/permission/:id",permissionValidator.handle(),permissionController.update);

//role
router.get("/role",roleController.index);
router.get("/role/create",roleController.create);
router.post("/role/create",roleValidator.handle(),roleController.store);

//delete course
router.delete("/role/:id",roleController.destroy);

//edit Course
router.get("/role/:id/edit",roleController.edit);
router.put("/role/:id",roleValidator.handle(),roleController.update);

//user
router.get("/user",userController.index);
router.get("/user/create",userController.create);
router.post("/user/create",userValidator.handle(),userController.store);

//delete course
router.delete("/user/:id",userController.destroy);

//edit Course
router.get("/user/:id/edit",userController.edit);
router.put("/user/:id",userValidator.handle(),userController.update);

//add user roll
router.get("/user/:id/userRoles",userController.userRoles);
router.put("/user/:id/addUserRoles",userController.addUserRoles);

router.get("/user/:id/adminAccess",userController.adminAccess);

//chat
router.get("/chat",chatController.chatForm);
router.get("/chat-room",chatController.chatRoom);

module.exports=router;
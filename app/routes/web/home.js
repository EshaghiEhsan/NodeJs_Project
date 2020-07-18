const express=require("express");
const router=express.Router();

const homeController=require("./../../http/controller/homeController");
const commentController=require("./../../http/controller/comment/commentController");
const courseController=require("./../../http/controller/course/courseController");
const articleController=require("./../../http/controller/article/articleController");

router.get("/",homeController.index);

//logout 

router.get("/logout" ,(req,res)=>{
    req.logout();
    res.clearCookie("remember_token");
    res.redirect("/");
})

router.get("/course/:course",homeController.coursePage);
router.get("/download/:id",homeController.download);
router.get("/article/:article",homeController.articlePage);

router.get("/courses",courseController.allCourse);
router.get("/articles",articleController.allArticle);

// comment
router.post("/comment",commentController.comment);

//payment
router.post("/course/payment",courseController.payment);
router.get("/course/payment/callbackurl",courseController.callbackurl);


module.exports=router;
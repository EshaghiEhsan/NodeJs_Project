//const mongoose=require("mongoose");
//const User=require("./../../../models/users");
//const autoBind=require("auto-bind");
const controller=require("./../controller");
const {validationResult}=require("express-validator");
const passport =require("passport");

class registerController extends controller{

    showForm(req,res){
        res.render('home/auth/register' , {messages : req.flash('errors'),
        recaptcha:this.recaptcha.render()});
    }

    async registerProcess(req,res,next){
        await this.validationRecaptcha(req,res)
        const result =await this.validationForm(req,res);
            if(result){
                this.register(req,res,next);
            }else{
                res.redirect("/auth/register");
            }

        }
        
        // const adduser=new User({
        //     name:req.body.name,
        //     email:req.body.email,
        //     password:req.body.password
        // });

        //adduser.save();
        //res.redirect("/");
    
    register(req,res,next){
        passport.authenticate("local.register",{
            successRedirect:"/",
            failureRedirect:"/auth/register",
            failureMessage:true
        })(req,res,next)
    }
}

module.exports=new registerController();
const controller=require("../controller");
const User=require("../../../models/users");
const passwordReset=require("../../../models/password-reset");
const uniqueString=require("unique-string");

class forgetpasswordController extends controller{
    showForm(req,res,next){
        res.render("home/auth/password/reset",{messages:req.flash("errors"),success:req.flash("success"),
        recaptcha:this.recaptcha.render()});
    }

    async passwordResetLink(req,res,next){
        await this.validationRecaptcha(req,res);
        let result=await this.validationForm(req);
        if(result) return this.resetLinkProcess(req,res,next);
        else 
           res.redirect("/auth/password/reset")
    }

    async resetLinkProcess(req,res,next){
        let user=await User.findOne({email:req.body.email});
        if(!user){
            req.flash("errors","کاربری با این ایمیل در سایت ثبت نام نکرده است");
            return this.back(req,res);
        }
        
        //send Email

        const setpassword=new passwordReset({
            email:req.body.email,
            token:uniqueString()
        })
        await setpassword.save(err=>{
            console.log(err);
        })

        req.flash("success","لینک تغییر رمز عبور به ایمیل وارد شده ارسال شد");
        res.redirect("/auth/password/reset");
    }
}
module.exports=new forgetpasswordController();
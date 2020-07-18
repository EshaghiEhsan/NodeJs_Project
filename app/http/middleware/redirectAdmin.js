const middleware=require("./middleware");

class redirectAdmin extends middleware{
    handle(req,res,next){
        if(req.isAuthenticated() && req.user.admin){
            next();
        }else{
            res.redirect("/");
        }
    }
}

module.exports=new redirectAdmin();
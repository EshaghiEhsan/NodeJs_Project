class redirectAuthenticated{
    handle(req,res,next){
        if(req.isAuthenticated()) res.redirect("/")
        next()
    }
}

module.exports=new redirectAuthenticated();
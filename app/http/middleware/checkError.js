const middleware =require("./middleware");

class checkError extends middleware{
    async get404(req,res,next){
        try{
            this.error("چنین صفحه ای وجود ندارد",404)
        }catch (err) {
            next(err);
        }
    }

    async handle(err,req,res,next){
        const statusCode=err.status || 500;
        const message=err.message || "";
        const stack=err.stack || "";

        if(config.debug) return res.render("error/stack",{statusCode,message,stack});
        return res.render(`error/${statusCode}`,{message});
    }


}

module.exports=new checkError();
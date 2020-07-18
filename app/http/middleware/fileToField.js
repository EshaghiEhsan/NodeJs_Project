const middleware =require("./middleware");

class fileToField extends middleware{
    handle(req,res,next){
       // console.log(req.body);
        if(!req.file){
            req.body.images=undefined
        }else{
            req.body.images=req.file.originalname
        }
        next();
    }
}

module.exports=new fileToField();
const controller=require("./controller");
const User =require("app/models/users");

class adminController extends controller{
    async index(req,res,next){
        const user=await User.findById(req.user._id).populate("courses").exec();
        res.render("admin/index")
    }
}

module.exports=new adminController();
const middleware =require("./middleware");
const Permission=require("../../models/permission");

class checkUserAccess extends middleware{
    check(perm){
        return async (req,res,next)=>{
            const permissions=await Permission.find({name:perm}).populate("roles").exec();
            permissions.forEach(permission=>{
                let Roles=permission.roles.map(role=>role._id);
                return req.user.hasRoles(Roles)?next():res.redirect("/admin")
            })
        }
    }
}

module.exports=new checkUserAccess();
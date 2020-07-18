const controller=require("./../controller");
const Comment=require("app/models/comments");

class commentController extends controller{

    async index(req,res,next){
        const comments=await Comment.paginate({},{limit:25,sort:{createdAt:1},populate:[{
            path:"user",
            select:"name"
        },
            "course",
            "article"
        ]})

        res.render("admin/comment/index",{comments});
    }

     comment(req,res,next){
        const addComment=new Comment({
            user:req.user.id,
            ...req.body
        })
        addComment.check=false;
        addComment.save();
        return this.back(req,res);
    }

    async destroy(req,res,next){
        const comment=await Comment.findById(req.params.id).populate([{path:"comments"},{path:"autoSection"}]).exec();
        if(!comment){
            return res.json("چنین دیدگاهی وجود ندارد");
        }
        comment.comments.forEach(comment=>comment.remove());
        await comment.autoSection.inc("commentCount",-1);
        comment.remove();
        return this.back(req,res);
    }

    async update(req,res,next){
        const comment=await Comment.findById(req.params.id).populate("autoSection").exec();
        if(!comment){
            return res.json("چنین دیدگاهی وجود ندارد");
        }
        comment.check=true;
        await comment.autoSection.inc("commentCount")
        comment.save();
        return this.back(req,res);
    }

}

module.exports=new commentController();
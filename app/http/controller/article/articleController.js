const controller=require("../controller");
const Article=require("../../../models/article");
const Category=require("../../../models/category");
const fs=require("fs");
const sharp=require("sharp");
const faker=require("faker");
const path=require("path");

class articleController extends controller{
    async index(req,res,next){

        let page=req.query.page || 1;

        const articles=await Article.paginate({},{page,limit:10,sort:{createAt:1},populate:{path:"comments"}});
        res.render("admin/article/index",{articles});
        
    }

    async create(req,res,next){
        const categories=await Category.find({});
        res.render("admin/article/create",{categories});
    }

    async edit (req,res,next){
        const categories=await Category.find({});
        const article=await Article.findById(req.params.id);
        res.render("admin/article/edit",{categories,article});
    }

    async store(req,res,next){
      let result = await this.validationForm(req);
        if (result) {
            this.storeProcess(req, res, next);
        } else {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
            this.back(req, res);
        }
    }

    storeProcess(req,res,next){
        let images = this.resizeImage(req.file)
        let { title, body, tags } = req.body;
        const addarticle = new Article({
            user: req.user._id,
            title,
            slug: this.slug(title),
            images,
            body,
            tags
        })

        addarticle.save(err => { console.log(err) });
        res.redirect('/admin/article');
    }
    slug(title){
        return title.replace(/([^۰-۹آ-یa-z0-9]|-) + /g , "-")
    }

    getDirImage(dir){
        return dir.substring(8);
    }


    async update(req,res,next){
        let result=await this.validationForm(req);
        
        //console.log(result);
        if(result){
            this.updateProcess(req,res,next);
        }else{
           
            if(req.file){
                fs.unlinkSync(req.file.path);
            }
            this.back(req,res);
        }
    }
    async updateProcess(req,res,next){
       
        let imageUrl={};

        if(req.file){
            imageUrl.images=this.resizeImage(req.file)
        }
        delete req.body.images;
        await Article.findByIdAndUpdate(req.params.id,{$set:{...req.body,...imageUrl}});
        
        
        return res.redirect("/admin/article");
    }

    async destroy(req,res,next){
        let article=await Article.findById(req.params.id).populate("comments").exec();
        if(!article){
            res.json("چنین دوره ای در سایت ثبت نشده است");
        }

        //delete episode
        article.comments.forEach(comment=>comment.remove());
        Object.values(article.images).forEach(image=>fs.unlinkSync(`./public${image}`));

        article.remove();

        return res.redirect("/admin/article");
    }

    resizeImage(image){
        
        const imagePath=path.parse(image.path);
        let imageUrl={};
        imageUrl["original"]=this.getDirImage(`${image.destination}/${image.filename}`);
        let resize=size=>{
            const imageName=`${imagePath.name}-${size}${imagePath.ext}`;
            imageUrl[size]=this.getDirImage(`${image.destination}/${imageName}`);

            sharp(image.path).resize(size,null)
            .toFile(`${image.destination}/${imageName}`);
        }

        [1080,720,480,360].map(resize);
        console.log(imageUrl);
        return imageUrl;
        
    }


    async allArticle(req,res,next){
        let page=req.query.page || 1;
        let query={};
        if(req.query.search)
            query.title=new RegExp(req.query.search,"gi") ;
        if(req.query.category&&req.query.category!="all"){
            let category=await Category.findOne({slug:req.query.category});
            if(category){
                query.categories={$in:[category.id]};
            }
        }
        const categories=await Category.find({});
        const articles =await Article.paginate({...query},{page,limit:16,sort:{createdAt:req.query.old || -1}});
        res.render("home/page/articles",{articles,categories});
    }

}

module.exports=new articleController();
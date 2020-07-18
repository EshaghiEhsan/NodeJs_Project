const controller=require("../controller");
const Course=require("../../../models/course");
const fs=require("fs");
const sharp=require("sharp");
const path=require("path");
const Category=require("../../../models/category");
const request=require("request-promise");
const Payment=require("app/models/payment");
const User=require("app/models/users");

class courseController extends controller{
    async index(req,res,next){

        let page=req.query.page || 1;

        const courses=await Course.paginate({},{page,limit:10,sort:{createAt:1}});

        this.alert(req,{
            type:"info",
            title:"courses",
            text:"welcome to this page"
        })

        res.render("admin/course/index",{courses});
        
    }

    async create(req,res,next){
        const categories=await Category.find({});
        res.render("admin/course/create",{categories});
    }

    async edit (req,res,next){
        const categories=await Category.find({});
        const course=await Course.findById(req.params.id);
        res.render("admin/course/edit",{course,categories});
    }

    async store(req,res,next){
        let result=await this.validationForm(req);
        
        //console.log(result);
        if(result){
            this.storeProcess(req,res,next);
        }else{
            //console.log(req.file);
            if(req.file){
                fs.unlink(req.file.path,(err)=>{console.log(err)});
            }
            this.back(req,res);
        }
    }

    storeProcess(req,res,next){
        let images=this.resizeImage(req.file);
        let {title,body,type,price,tags}=req.body;

        const addcourse=new Course({
            user:req.user._id,
            title,
            slug:this.slug(title),
            images,
            body,
            type,
            price,
            tags
        })
        addcourse.save(err=>console.log(err))
        res.redirect("/admin/course");
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
            //console.log(req.file);
            if(req.file){
                fs.unlink(req.file.path);
            }
            this.back(req,res);
        }
    }
    async updateProcess(req,res,next){

        let imageUrl={};

        if(req.file){
            imageUrl.images=this.resizeImage(req.file)
        }else{
            delete req.body.images;
            await Course.findByIdAndUpdate(req.params.id,{$set:{...req.body,...imageUrl}});
        }
        
        return res.redirect("/admin/course");
    }

    async destroy(req,res,next){
        let course=await Course.findById(req.params.id).populate("episodes").exec();
        if(!course){
            res.json("چنین دوره ای در سایت ثبت نشده است");
        }

        //delete episode
        course.episodes.forEach(episode=>episode.remove());

        Object.values(course.images).forEach(image=>fs.unlinkSync(`./public${image}`));
        
        course.remove();

        return res.redirect("/admin/course");
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

        return imageUrl;
    }

    async allCourse(req,res,next){
        let page=req.query.page || 1;
        let query={};
        if(req.query.search)
            query.title=new RegExp(req.query.search,"gi") ;
        if(req.query.type && req.query.type !="all")
            query.type=req.query.type;
        if(req.query.category&&req.query.category!="all"){
            let category=await Category.findOne({slug:req.query.category});
            if(category){
                query.categories={$in:[category.id]};
            }
        }
        const categories=await Category.find({});
        const courses =await Course.paginate({...query},{page,limit:16,sort:{createdAt: req.query.old ||-1}});
        res.render("home/page/courses",{courses,categories});
    }

    async payment(req,res,next){
        const course=await Course.findById(req.body.course);
        if(!course){
            res.json("چنین دوره ای وجود ندارد");
        }
        if(req.user.checkpayCash(course.id)){
            res.json("شما قبلا این دوره را خریداری کرده اید");
        }
        if(course.price==0 && (course.price=="vip" || course.type=="free")){
            res.json("خریداری ای دوره امکان پذیر نیس");
        }

        let params = {
            MerchantID: '97221328-b053-11e7-bfb0-005056a205be',
            Amount: course.price,
            CallbackURL: 'http://localhost:3000/course/payment/callbackurl',
            Description: `حرید دوره ${course.title}`,
            Email: req.user.email,
        }

        let options =this.getOptions("https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json",params);

        request(options).then(async data=>{
            const addPayinfo=new Payment({
                user:req.user.id,
                course:course.id,
                resNumber:data.Authority,
                price:course.price
            })
            addPayinfo.save();
            res.redirect(`https://www.zarinpal.com/pg/StartPay/${data.Authority}`);
        }).catch(err=>res.json(err.message))

    }

    async callbackurl(req,res,next){
        const payment=await Payment.findOne({resNumber:req.query.Authority}).populate("course").exec();
        if(!payment.course){
            res.json("not course")
        }

        if(req.query.Satatus && req.query.Status !="OK"){
            res.json("not Ok")
        }

        let params={
            MerchantID: '97221328-b053-11e7-bfb0-005056a205be',
            Authority:req.query.Authority,
            Amount:payment.course.price,
        }

        let options =this.getOptions("https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json",params);

        request(options).then(async data=>{
            if(data.Status==100){
                payment.set({payment : true});
                await User.updateOne({"_id":req.user.id},{$set:{payCash:payment.course.id}});
                await payment.save();

                res.redirect(payment.course.path());
            }else{
                res.json("payment not execute")
            }
        }).catch(err=>res.json(err.message));


    }

    getOptions(url,params){
        return{
            method:"POST",
            url:url,
            header:{
                "cache-control":"no-cache",
                "content-type":"application/json"
            },
            body:params,
            json:true
        }
    }



}

module.exports=new courseController();
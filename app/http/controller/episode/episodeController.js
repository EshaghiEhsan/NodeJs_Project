const controller=require("../controller");
const Episode=require("app/models/episode");
const Course=require("app/models/course");

class episodeController extends controller{

    async index(req,res,next){
        try {

            let page =req.query.page || 1;
            const episodes =await Episode.paginate({},{page,limit:10,sort:{createAt:1},populate:"course"});
            res.render("admin/episode/index",{episodes});

        }catch (err) {
            next(err);
        }

    }

    async create(req,res,next){
        const courses=await Course.find({});
        res.render("admin/episode/create",{messages:req.flash("errors"),courses});
    }

    async edit (req,res,next){
        const episode=await Episode.findById(req.params.id);
        const courses=await Course.find({});
        res.render("admin/episode/edit",{messages:req.flash("errors"),episode,courses});
    }

    async store(req,res,next){
        let result=await this.validationForm(req);
        if(result){
            this.storeProcess(req,res,next);
        }else{
            this.back(req,res);
        }
    }

    storeProcess(req,res,next){

        try{
            const addepisode=new Episode({...req.body})
            addepisode.save(err=>console.log(err))

            // update course time
            this.updateCourseTime(req.body.course);
            res.redirect("/admin/episode");
        }catch (error) {
            next(error);
        }



    }

    async update(req,res,next){
        let result=await this.validationForm(req);
        
        if(result){
            this.updateProcess(req,res,next);
        }else{
            this.back(req,res);
        }
    }

    async updateProcess(req,res,next){

        const episode=await Episode.findByIdAndUpdate(req.params.id,{$set:{...req.body}});

        // update course time 
        this.updateCourseTime(episode.course);

        //update eoisode time
        this.updateCourseTime(req.body.course);

        return res.redirect("/admin/episode");
    }

    async destroy(req,res,next){
        let episode=await Episode.findById(req.params.id);
        if(!episode){
            res.json("چنین ویدیو‌ای وجود ندارد");
        }

        // update course time 
        this.updateCourseTime(episode.course);

        episode.remove();
        return res.redirect("/admin/episode");
    }

    async updateCourseTime(courseId){
        const course=await Course.findById(courseId).populate("episodes").exec();
        //const episodes=await Episode.find({course:courseId});
        course.set({time:this.getTime(course.episodes)})
        await course.save();
    }

   

}

module.exports=new episodeController();
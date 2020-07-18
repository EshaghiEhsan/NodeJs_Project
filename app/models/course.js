const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const mongoosePaginate=require("mongoose-paginate");

const Course=mongoose.Schema({

    user:{type : Schema.Types.ObjectId , ref : 'User'},
    title:{type:String,required:true},
    slug:{type:String,default:""},
    body:{type:String,required:true},
    type:{type:String,default:""},
    images:{type:Object,required:true},
    price:{type:String,required:true},
    time:{type : String , default : "00:00:00"},
    tags:{type:String,required:true},
    viewCount:{type:Number,default:0},
    categories:[{type:Schema.Types.ObjectId,ref:"Category"}],
    commentCount:{type:Number,default:0}
},{
    timestamps:true,
    toJSON:{virtual:true}
})

Course.plugin(mongoosePaginate);


Course.virtual("episodes",{
    ref:"Episode",
    localField:"_id",
    foreignField:"course"
});

Course.virtual("comments",{
    ref:"Comment",
    localField:"_id",
    foreignField:"course"
});


Course.methods.path=function(){
    return `/course/${this.slug}`;
}

Course.methods.inc=async function(field,num=1){
    this[field]+=num;
    await this.save();
}


module.exports=mongoose.model("Course",Course);
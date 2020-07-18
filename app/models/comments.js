const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const mongoosePaginate=require("mongoose-paginate");

const Comment=mongoose.Schema({

    user:{type : Schema.Types.ObjectId , ref : 'User'},
    course:{type : Schema.Types.ObjectId , ref : 'Course',default:undefined},
    article:{type : Schema.Types.ObjectId , ref : 'Article',default:undefined},
    comment:{type:String,required:true},
    parent:{type:Schema.Types.ObjectId , ref : 'Comment',default:null},
    check:{type:Boolean,default:false},
},{
    timestamps:true,
    toJSON:{virtual:true}
})


Comment.virtual("comments",{
    ref:"Comment",
    localField:"_id",
    foreignField:"parent"
});


Comment.virtual('autoSection', {
    ref: doc => {
        if (doc.course)
            return 'Course'
        else if (doc.article)
            return 'Article'
    },
    localField: doc => {
        if (doc.course)
            return 'course'
        else if (doc.article)
            return 'article'
    },

    foreignField: '_id',
    justOne : true
})


Comment.plugin(mongoosePaginate);


module.exports=mongoose.model("Comment",Comment);
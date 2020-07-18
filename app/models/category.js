const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')
const Category = mongoose.Schema({
    name : { type : String , required : true},
    slug : { type : String, required : true},
    parent : { type : Schema.Types.ObjectId, ref : 'Category'}

} , {
    timestamps : true,
    toJSON : { virtuals : true}
})


Category.plugin(mongoosePaginate);

Category.virtual('childs', {
    ref : 'Category',
    localField : '_id',
    foreignField : 'parent'
})


module.exports = mongoose.model('Category' , Category);
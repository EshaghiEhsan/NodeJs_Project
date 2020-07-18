const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')
const Permission = mongoose.Schema({
    name : { type : String , required : true},
    label : { type : String, required : true},
} , {
    timestamps : true,
    toJSON : { virtuals : true}
})

Permission.plugin(mongoosePaginate);

Permission.virtual('roles' , {
    ref : 'Role',
    localField : '_id',
    foreignField : 'permissions'
})

module.exports = mongoose.model('Permission' , Permission);
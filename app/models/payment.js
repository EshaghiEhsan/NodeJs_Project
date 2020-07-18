const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')
const Payment = mongoose.Schema({
    vip : { type : Boolean , default:false},
    course : { type : Schema.Types.ObjectId, ref : 'Course',default:null},
    user : { type : Schema.Types.ObjectId, ref : 'User'},
    payment : { type : Boolean , default:false},
    resNumber : { type : String , required:true},
    price : { type : Number , required:true}

} , {
    timestamps : true,
    toJSON : { virtuals : true}
})


Payment.plugin(mongoosePaginate);


module.exports = mongoose.model('Payment' , Payment);

const mongoose = require('../db/mongoose')

//创建一个schema
let Schema = {

    "book_id": {
        type:String,
        required:true,
    },

    "user_id": {
        type:String,
        required: true
    },


    "start_time": Date,

    "end_time": Date,

    "state": {
        type:Number,
        default:0  //0 借阅中；1：已归还
    },

}


let BookUserRelation = mongoose.model("BookUserRelation", Schema);

module.exports=BookUserRelation;


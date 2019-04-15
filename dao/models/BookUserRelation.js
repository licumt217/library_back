
const mongoose = require('../mongoose')

//创建一个schema
let Schema = {

    "bookId": {
        type:String,
        required:true,
    },

    "userId": {
        type:String,
        required: true
    },


    "startTime": Date,

    "endTime": Date,

    "state": {
        type:Number,
        default:0  //0 借阅中；1：已归还
    },
    "isRenew":{  //是否续借
        type:Boolean,
        default: false
    }

}


let BookUserRelation = mongoose.model("BookUserRelation", Schema);

module.exports=BookUserRelation;


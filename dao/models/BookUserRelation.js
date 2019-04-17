
const mongoose = require('../mongoose')

//创建一个schema
let Schema = {


    "startTime": Date,

    "endTime": Date,

    "state": {
        type:Number,
        default:0  //0 借阅中；1：已归还
    },
    "isRenew":{  //是否续借
        type:Boolean,
        default: false
    },              //还书日期
    "backTime":Date,
    "book":{type:mongoose.Schema.Types.ObjectId,ref:'Book'},
    "user":{type:mongoose.Schema.Types.ObjectId,ref:'User'},

}


let BookUserRelation = mongoose.model("BookUserRelation", Schema);

module.exports=BookUserRelation;


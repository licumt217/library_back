
const mongoose = require('../mongoose')

//创建一个schema
let Schema = {

    "username": {
        type:String,
        required:true,
        unique:true
    },

    "password": {
        type:String,
        required: true,
        default: "123456"
    },

    "name": String,

    "studentNumber": String,

    "jobNumber": String,

    "type": {
        type:Number,
        default:0  //0 学生；1：教师；2：管理员
    },
    "passwordUptTime":{//密码修改时间，记录用户改密码的时间
        type:Date
    }

}


let User = mongoose.model("User", Schema);

module.exports=User;


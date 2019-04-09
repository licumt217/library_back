
const mongoose = require('../db/mongoose')

//创建一个schema
let Schema = {

    "username": {
        type:String,
        required:true,
        unique:true
    },

    "password": {
        type:String,
        required: true
    },

    "name": String,

    "student_number": String,

    "job_number": String,

    "type": {
        type:Number,
        default:0  //0 学生；1：教师；2：管理员
    },

}


let User = mongoose.model("User", Schema);

module.exports=User;


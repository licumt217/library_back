
const mongoose = require('../mongoose')

//创建一个schema
let Schema = {


    "userId": {
        type:String,
        required:true
    },
    "roleId": {
        type:String,
        required:true
    },

    "opUserId": {
        type:String,
    },

    "updateTime": {
        type:Date,
    },

}


let UserRoleRelation = mongoose.model("UserRoleRelation", Schema);

module.exports=UserRoleRelation;


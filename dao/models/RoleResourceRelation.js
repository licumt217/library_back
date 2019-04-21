
const mongoose = require('../mongoose')

//创建一个schema
let Schema = {


    "roleId": {
        type:String,
        required:true
    },
    "resourceIdArray": {
        type:Array,
        required:true
    },

    "opUserId": {
        type:String,
    },

    "updateTime": {
        type:Date,
    },

}


let RoleResourceRelation = mongoose.model("RoleResourceRelation", Schema);

module.exports=RoleResourceRelation;


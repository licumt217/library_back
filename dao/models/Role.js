
const mongoose = require('../mongoose')

//创建一个schema
let Schema = {

    "name": {
        type:String,
        required:true,
        unique:true
    },

    "opUserId": {
        type:String,
    },

    "updateTime": {
        type:Date,
    },

}


let Role = mongoose.model("Role", Schema);

module.exports=Role;


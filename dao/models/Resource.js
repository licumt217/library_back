
const mongoose = require('../mongoose')

//创建一个schema
let Schema = {

    "name": {
        type:String,
        required:true,
        unique:true
    },

    "url": {
        type:String,
        required:true,
        unique:true
    },

    "order": {//菜单排序
        type:Number
    },
    "icon": {
        type:String,
        default:'ios-paper'
    },
    "activeName":{//菜单序号，用户前端选中效果匹配
        type:String,
        required:true,
        default: String(Math.random())
    },
    "code":{//
        type:String,
        required:true
    },
    "parentCode":{//
        type:String,
        required:true
    },
    "opUserId":{//
        type:String,
        required:true
    },
    "children":{
        type:Array
    }

}






let Resource = mongoose.model("Resource", Schema);

module.exports=Resource;


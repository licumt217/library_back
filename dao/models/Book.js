
const mongoose = require('../mongoose')

//创建一个schema
let Schema = {

    "name": {
        type:String,
        required:true,
        unique:true
    },

    "author": {
        type:String,
    },

    "type": {
        type:String,
    },

}


let Book = mongoose.model("Book", Schema);

module.exports=Book;


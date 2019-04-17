
const mongoose = require('../mongoose')

//创建一个schema
let Schema = {

    "endTime": {
        type:String,
        required:true,
    },
    "opTime":Date,

    "bookUserRelationId": {
        type:String,
        required:true,
    },

}


let BorrowRecord = mongoose.model("BorrowRecord", Schema);

module.exports=BorrowRecord;


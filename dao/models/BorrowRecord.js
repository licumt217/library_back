
const mongoose = require('../mongoose')

//创建一个schema
let Schema = {

    "startTime": {
        type:String,
        required:true,
    },
    "endTime": {
        type:String,
        required:true,
    },
    "bookUserRelationId": {
        type:String,
        required:true,
    },

}


let BorrowRecord = mongoose.model("BorrowRecord", Schema);

module.exports=BorrowRecord;


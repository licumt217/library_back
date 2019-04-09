const mongoose = require('mongoose');

//连接数据库，数据库叫做/studentmanagement。如果数据库不存在会自动创建。
mongoose.connect('mongodb://localhost/library', {
    useNewUrlParser: true
});

module.exports=mongoose;

const User=require('./dao/models/User')

User.create({
    username:'33333333323232323',
    password:'llll'
}).then((data)=>{
    console.log('..............')
    console.log(3,data)
}).catch((err)=>{
    if(err){
        console.log(err)
    }
})
//
// User.find().then(data=>{
//     console.log(data)
// })

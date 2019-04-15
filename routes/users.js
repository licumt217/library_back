const express = require('express');
const router = express.Router();
const Response = require('../config/response')
const User = require('../dao/models/User')
const UserService = require('../dao/service/UserService')
const log4js = require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const entityName='用户'

// 新增
router.post('/add', function (req, res) {

    logger.info(`新增${entityName}参数：`,req.body)

    UserService.find({
        username:req.body.username
    }).then(data=>{
        if(data && data.length>0){
            return Promise.reject(`${entityName}已存在！`)
        }else{
            return Promise.resolve()
        }
    }).then(()=>{
        let user = new User(req.body);

        return UserService.save(user).then(data=>{
            res.send(Response.success(data));
        })
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })

})


// 删除
router.post('/remove', function (req, res) {

    logger.info(`删除${entityName}参数：`,req.body)

    let userId=req.body._id


    UserService.find({
        _id:userId
    }).then(data=>{
        if(!data || data.length===0){
            return Promise.reject(`${entityName}不存在！`)
        }else{
            return Promise.resolve()
        }
    }).then(()=>{
        UserService.remove(userId).then(()=>{
            res.send(Response.success());
        }).catch(err=>{
            logger.info(err)
            res.send(Response.businessException(err))
        })
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })







})

// 登录
router.post('/login', function (req, res) {

    logger.info(`${entityName}登录参数：`,req.body)

    let username=req.body.username

    let whereObj={
        username:username
    };

    UserService.find(whereObj).then(data=>{

        if(data && data.length>0){

            return Promise.resolve();
        }else{
            return Promise.reject(`${entityName}不存在`);
        }
    }).then(()=>{
        whereObj={
            username:username,
            password:req.body.password
        };

        return UserService.find(whereObj).then(data=>{
            if(data && data.length>0){
                res.send(Response.success(data[0]));

            }else{
                return Promise.reject("密码不正确！")
            }
        })
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })
})

// 修改用户信息
router.post('/update', function (req, res) {

    logger.info(`修改${entityName}信息参数：`,req.body)

    let updateObj=JSON.parse(JSON.stringify(req.body));

    UserService.update({
        _id:req.body._id
    },updateObj).then(()=>{
        res.send(Response.success());
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })
})

router.get('/list', function (req, res, next) {

    logger.info(`获取${entityName}列表的参数：`, req.body)

    UserService.find().then(data => {

        res.send(Response.success(data));

    }).catch(err => {
        logger.info(err)
        res.send(Response.businessException(err))
    })

});

module.exports = router;

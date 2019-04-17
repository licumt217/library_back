const express = require('express');
const router = express.Router();
const Response = require('../config/response')
const Entity = require('../dao/models/Book')
const mainService = require('../dao/service/BookService')
const log4js = require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const entityName='书籍'

// 新增
router.post('/add', function (req, res) {

    logger.info(`新增${entityName}参数：`,req.body)

    mainService.find({
        name:req.body.name
    }).then(data=>{
        if(data && data.length>0){
            return Promise.reject(`${entityName}已存在！`)
        }else{
            return Promise.resolve()
        }
    }).then(()=>{
        let entity = new Entity(req.body);

        return mainService.save(entity).then(data=>{
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

    let id=req.body._id


    mainService.find({
        _id:id
    }).then(data=>{
        if(!data || data.length===0){
            return Promise.reject(`${entityName}不存在！`)
        }else{
            return Promise.resolve()
        }
    }).then(()=>{
        mainService.remove(id).then(()=>{
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


// 修改用户信息
router.post('/update', function (req, res) {

    logger.info(`修改${entityName}信息参数：`,req.body)

    let updateObj=JSON.parse(JSON.stringify(req.body));

    mainService.update({
        _id:req.body._id
    },updateObj).then(()=>{
        res.send(Response.success());
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })
})

router.get('/list', function (req, res, next) {

    logger.info(`获取${entityName}列表的参数：`, req.query)

    mainService.find(req.query).then(data => {

        res.send(Response.success(data));

    }).catch(err => {
        logger.info(err)
        res.send(Response.businessException(err))
    })

});

router.get('/get', function (req, res, next) {

    logger.info(`获取${entityName}实例的参数：`, req.query)

    let bookId=req.query._id;
    if(!bookId){
        res.send(Response.businessException('书籍ID不能为空！'))
    }

    mainService.find(req.query).then(data => {
        if(data && data.length>0){
            res.send(Response.success(data[0]));
        }else{
            res.send(Response.businessException('未找到对应书籍'))
        }


    }).catch(err => {
        logger.info(err)
        res.send(Response.businessException(err))
    })

});



module.exports = router;

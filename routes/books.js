const express = require('express');
const router = express.Router();
const Response = require('../config/response')
const Entity = require('../dao/models/Book')
const mainService = require('../dao/service/BookService')
const log4js = require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const entityName='书籍'

// 新增
router.post('/add', async function (req, res) {

    logger.info(`新增${entityName}参数：`,req.body)

    try{

        let whereObj={
            name:req.body.name
        }

        let data = await mainService.find(whereObj)

        if(data && data.length>0){

            res.send(Response.businessException(`${entityName}已存在！`))

        }else{

            let entity = new Entity(req.body);

            data= await mainService.save(entity);

            res.send(Response.success(data));
        }

    }catch(err){

        logger.info(err)
        res.send(Response.businessException(err))

    }

})


// 删除
router.post('/remove', async function (req, res) {

    logger.info(`删除${entityName}参数：`,req.body)

    let id=req.body._id

    let whereObj={
        _id:id
    }

    try{

        let data= await mainService.find(whereObj)

        if(!data || data.length===0){

            res.send(Response.businessException(`${entityName}不存在！`))

        }else{

            await mainService.remove(id)

            res.send(Response.success());

        }

    }catch(err){

        logger.info(err)
        res.send(Response.businessException(err))

    }

})


// 修改用户信息
router.post('/update',async function (req, res) {

    logger.info(`修改${entityName}信息参数：`,req.body)

    let whereObj={
        _id:req.body._id
    }

    let updateObj=JSON.parse(JSON.stringify(req.body));

    try{

        await mainService.update(whereObj,updateObj)

        res.send(Response.success());

    }catch(err){

        logger.info(err)
        res.send(Response.businessException(err))

    }

})

router.get('/list', async function (req, res, next) {

    logger.info(`获取${entityName}列表的参数：`, req.query)

    try{

        let data= await mainService.find(req.query);

        res.send(Response.success(data));

    }catch(err){

        logger.info(err)
        res.send(Response.businessException(err))

    }

});

router.get('/findById', async function (req, res, next) {

    logger.info(`获取${entityName}实例的参数：`, req.query)

    let id=req.query._id;

    if(!id){
        res.send(Response.businessException(`${entityName}ID不能为空`))
    }

    try{

        let data= await mainService.findById(id)

        res.send(Response.success(data));

    }catch(err){

        logger.info(err)
        res.send(Response.businessException(err))

    }

});



module.exports = router;

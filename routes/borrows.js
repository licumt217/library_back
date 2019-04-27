const express = require('express');
const router = express.Router();
const Response = require('../config/response')
const Entity = require('../dao/models/BookUserRelation')
const BorrowRecordEntity = require('../dao/models/BorrowRecord')
const mainService = require('../dao/service/BookUserRelationService')
const BorrowRecordService = require('../dao/service/BorrowRecordService')
const log4js = require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const entityName = '借阅'

// 新增
router.post('/add', async function (req, res) {

    logger.info(`新增${entityName}参数：`, req.body)

    if (!req.body.book) {
        res.send(Response.businessException('书籍ID不能为空！'))
    }

    let whereObj = {
        book: req.body.book,
        state: 0,
    }

    try {
        let data = await mainService.findOne(whereObj);


        if (data) {

            res.send(Response.businessException(`${entityName}已存在！`！'))

        } else {

            let entity = new Entity(req.body);
            entity.startTime = new Date();

            data = await mainService.save(entity);

            //添加借阅记录
            let record = new BorrowRecordEntity({
                bookUserRelationId: data._id,
                startTime: data.startTime,
                endTime: data.endTime,
            })

            data = await BorrowRecordService.save(record);

            res.send(Response.success(data));

        }
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }


})


// 续借
router.post('/update',async function (req, res) {

    logger.info(`修改${entityName}信息参数：`, req.body)

    let updateObj = JSON.parse(JSON.stringify(req.body));
    updateObj.isRenew = true;

    let whereObj={
        _id: req.body._id
    }

    try{
        await mainService.update(whereObj, updateObj);

        //添加借阅记录
        let {_id, endTime} = req.body;
        let record = new BorrowRecordEntity({
            bookUserRelationId: _id,
            endTime: endTime,
            opTime: new Date()
        })

        await BorrowRecordService.save(record);

        res.send(Response.success());
    }catch(err){
        logger.info(err)
        res.send(Response.businessException(err))
    }
})


// 归还
router.post('/back', async function (req, res) {

    logger.info(`归还${entityName}信息参数：`, req.body)

    let whereObj={
        _id: req.body._id,
        state: 0,
    }

    try{
        let data=await mainService.findOne(whereObj);

        if (!data ) {

            res.send(Response.businessException(`${entityName}不存在！`))

        } else {

            let updateObj = JSON.parse(JSON.stringify(req.body));

            updateObj.state = 1;
            updateObj.backTime = new Date();

            whereObj={
                _id: req.body._id
            }

            await mainService.update(whereObj, updateObj)

            res.send(Response.success());
        }
    }catch(err){
        logger.info(err)
        res.send(Response.businessException(err))
    }



})

router.get('/list', async function (req, res, next) {

    logger.info(`获取${entityName}列表的参数：`, req.query)

    try{
        let data=await mainService.find(req.query)

        res.send(Response.success(data));
    }catch(err){
        logger.info(err)
        res.send(Response.businessException(err))
    }

});

module.exports = router;

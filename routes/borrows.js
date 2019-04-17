const express = require('express');
const router = express.Router();
const Response = require('../config/response')
const Entity = require('../dao/models/BookUserRelation')
const BorrowRecordEntity = require('../dao/models/BorrowRecord')
const mainService = require('../dao/service/BookUserRelationService')
const BorrowRecordService = require('../dao/service/BorrowRecordService')
const log4js = require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const entityName='借阅'

// 新增
router.post('/add', function (req, res) {

    logger.info(`新增${entityName}参数：`,req.body)

    if(!req.body.book){
        res.send(Response.businessException('书籍ID不能为空！'))
    }

    mainService.find({
        book:req.body.book,
        state:0,
    }).then(data=>{
        if(data && data.length>0){
            return Promise.reject(`${entityName}已存在！`)
        }else{
            return Promise.resolve()
        }
    }).then(()=>{
        let entity = new Entity(req.body);
        entity.startTime=new Date();

        return mainService.save(entity).then(data=>{

            //添加借阅记录
            let record=new BorrowRecordEntity({
                bookUserRelationId:data._id,
                startTime:data.startTime,
                endTime:data.endTime,
            })
            BorrowRecordService.save(record).then(data2=>{
                res.send(Response.success(data));
            }).catch(err=>{
                logger.info(err)
                res.send(Response.businessException(err))
            });



        })
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })

})




// 续借
router.post('/update', function (req, res) {

    logger.info(`修改${entityName}信息参数：`,req.body)

    let updateObj=JSON.parse(JSON.stringify(req.body));
    updateObj.isRenew=true;

    mainService.update({
        _id:req.body._id
    },updateObj).then(()=>{
        //添加借阅记录
        let {_id,endTime}=req.body;
        let record=new BorrowRecordEntity({
            bookUserRelationId:_id,
            endTime:endTime,
            opTime:new Date()
        })
        BorrowRecordService.save(record).then(data2=>{
            res.send(Response.success());
        }).catch(err=>{
            logger.info(err)
            res.send(Response.businessException(err))
        });

    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })
})


// 归还
router.post('/back', function (req, res) {

    logger.info(`归还${entityName}信息参数：`,req.body)




    mainService.find({
        _id:req.body._id,
        state:0,
    }).then(data=>{
        if(!data || data.length===0){
            return Promise.reject(`${entityName}不存在！`)
        }else{
            return Promise.resolve()
        }
    }).then(()=>{
        let updateObj=JSON.parse(JSON.stringify(req.body));
        updateObj.state=1;
        updateObj.backTime=new Date();

        mainService.update({
            _id:req.body._id
        },updateObj).then(()=>{
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

router.get('/list', function (req, res, next) {

    logger.info(`获取${entityName}列表的参数：`, req.query)

    mainService.find(req.query).then(data => {

        res.send(Response.success(data));

    }).catch(err => {
        logger.info(err)
        res.send(Response.businessException(err))
    })

});

module.exports = router;

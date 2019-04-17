const express = require('express');
const router = express.Router();
const Response = require('../config/response')
const Entity = require('../dao/models/BorrowRecord')
const mainService = require('../dao/service/BorrowRecordService')
const log4js = require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const entityName='借阅记录'


router.get('/list', function (req, res, next) {

    logger.info(`获取${entityName}列表的参数：`, req.body)

    mainService.find().then(data => {

        res.send(Response.success(data));

    }).catch(err => {
        logger.info(err)
        res.send(Response.businessException(err))
    })

});

module.exports = router;

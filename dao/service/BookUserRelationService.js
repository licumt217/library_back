const log4js = require('../../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
let MainEntity = require('../models/BookUserRelation')
const entityName = "借阅关系";
let errorMsg = "";

let MainService = {
    save(entity) {
        return new Promise((resolve, reject) => {
            if (entity) {
                entity.save().then(data => {
                    logger.info(`新增${entityName}结果：`, data)
                    resolve(data);
                }).catch(err => {
                    errorMsg = `新增${entityName}异常！`
                    logger.info(errorMsg, err)
                    reject(errorMsg)
                })
            } else {
                errorMsg = `新增${entityName}不能为空！`
                logger.info(errorMsg)
                reject(errorMsg)
            }
        })
    },
    find(whereObj) {
        return new Promise((resolve, reject) => {

            if (!whereObj) {
                whereObj = {}
            }
            MainEntity.find(whereObj)
                .populate('book')
                .populate('user')
                .then(data => {

                    logger.info(`根据条件查询${entityName}结果：`, data)

                    resolve(data)

                }).catch(err => {
                errorMsg = `根据条件查询${entityName}异常！`
                logger.info(errorMsg, err)
                reject(errorMsg)
            })

        })
    },
    update(whereObj, updateObj) {
        return new Promise((resolve, reject) => {

            MainEntity.update(whereObj, updateObj).then(data => {
                logger.info(`修改${entityName}结果：`,data)
                resolve(data)
            }).catch(err => {
                errorMsg = `修改${entityName}信息异常！`
                logger.info(errorMsg, err)
                reject(errorMsg)
            })

        })
    }


}


module.exports = MainService

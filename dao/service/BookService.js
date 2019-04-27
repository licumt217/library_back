const log4js= require('../../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
let MainEntity=require('../models/Book')
const entityName="书籍";
let errorMsg="";

let MainService={

    save(entity){
        return new Promise((resolve,reject)=>{
            if(!entity){
                errorMsg=`新增${entityName}不能为空！`
                logger.info(errorMsg)
                reject(errorMsg)
                return;
            }

            entity.save().then(data=>{
                logger.info(`新增${entityName}结果：`,data);
                resolve(data);
            }).catch(err=>{
                errorMsg=`新增${entityName}异常！`
                logger.info(errorMsg,err)
                reject(errorMsg)
            })
        })
    },

    find(whereObj){
        return new Promise((resolve,reject)=>{

            if(!whereObj){
                whereObj={}
            }
            MainEntity.find(whereObj).then(data=>{
                logger.info(`根据条件查询${entityName}:`,data)
                resolve(data)
            }).catch(err=>{
                errorMsg=`根据条件查询${entityName}异常！`
                logger.info(errorMsg,err)
                reject(errorMsg)
            })

        })
    },
    findOne(whereObj){
        return new Promise((resolve,reject)=>{

            if(!whereObj){
                whereObj={}
            }
            MainEntity.findOne(whereObj).then(data=>{
                logger.info(`根据条件查询${entityName}:`,data)
                resolve(data)
            }).catch(err=>{
                errorMsg=`根据条件查询${entityName}异常！`
                logger.info(errorMsg,err)
                reject(errorMsg)
            })

        })
    },
    findById(id){
        return new Promise((resolve,reject)=>{

            MainEntity.findById(id).then(data=>{
                logger.info(`根据id查询${entityName}:`,data)

                if(data){
                    resolve(data)
                }else{
                    errorMsg=`根据id未找到对应${entityName}！`
                    logger.info(errorMsg)
                    reject(errorMsg)
                }

            }).catch(err=>{
                errorMsg=`根据id查询${entityName}异常！`
                logger.info(errorMsg,err)
                reject(errorMsg)
            })

        })
    },
    remove(id){
        return new Promise((resolve,reject)=>{

            MainEntity.findByIdAndDelete(id).then(data=>{
                logger.info(`根据id删除${entityName}结果：`,data)
                resolve(data)
            }).catch(err=>{
                errorMsg=`删除${entityName}异常！`
                logger.info(errorMsg,err)
                reject(errorMsg)
            })

        })
    },
    update(whereObj,updateObj){
        return new Promise((resolve,reject)=>{

            MainEntity.update(whereObj,updateObj).then(data=>{
                logger.info(`更新${entityName}结果：`,data)
                resolve(data)
            }).catch(err=>{
                errorMsg=`修改${entityName}信息异常！`
                logger.info(errorMsg,err)
                reject(errorMsg)
            })

        })
    }









}






module.exports = MainService

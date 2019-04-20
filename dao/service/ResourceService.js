const log4js= require('../../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
let MainEntity=require('../models/Resource')
const entityName="资源";
let errorMsg="";

let MainService={
    save(entity){
        return new Promise((resolve,reject)=>{
            if(entity){
                entity.save().then(data=>{
                    resolve(data);
                }).catch(err=>{
                    errorMsg=`新增${entityName}异常！`
                    logger.info(errorMsg,err)
                    reject(errorMsg)
                })
            }else{
                errorMsg=`新增${entityName}不能为空！`
                logger.info(errorMsg)
                reject(errorMsg)
            }
        })
    },
    remove(id){
        return new Promise((resolve,reject)=>{

            MainEntity.remove({
                _id:id
            }).then(data=>{
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
                resolve(data)
            }).catch(err=>{
                errorMsg=`修改${entityName}信息异常！`
                logger.info(errorMsg,err)
                reject(errorMsg)
            })

            MainEntity.remove

        })
    },
    find(whereObj){
        return new Promise((resolve,reject)=>{

            if(!whereObj){
                whereObj={}
            }
            MainEntity.find(whereObj).then(data=>{
                console.log('.......',data)
                resolve(data)
            }).catch(err=>{
                errorMsg=`根据条件查询${entityName}异常！`
                logger.info(errorMsg,err)
                reject(errorMsg)
            })

        })
    },


}






module.exports = MainService

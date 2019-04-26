const log4js= require('../../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const errlogger = log4js.getLogger('err')
let MainEntity=require('../models/Resource')
const userService=require('./UserService')
const userRoleRelationService=require('./UserRoleRelationService')
const roleResourceRelationService=require('./RoleResourceRelationService')
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
    /***
     * 将资源转为树形结构的
     * @param data 资源数组
     */
    handleResource2Level(data){
        let returnData=[];
        let secondNodeArray=[]
        for(let i=0;i<data.length;i++){
            let node=data[i]
            if(node.code.length===4){
                returnData.push(node)
            }else{
                secondNodeArray.push(node)
            }
        }

        for(let i=0;i<returnData.length;i++){
            let curPNode=returnData[i];
            for(let j=0;j<secondNodeArray.length;j++){
                let c=secondNodeArray[j]

                if(c.parentCode===curPNode.code){

                    returnData[i].children.push(c)
                }
            }
        }

        return returnData;
    },
    listByLevel(userId){
        return new Promise((resolve,reject)=>{






            userService.findById(userId).then(data=>{

                let user=data;

                let type=user.type;

                //超管返回所有，其它人根据权限获取
                if(type===2){
                    this.find({}).then(data => {

                        resolve(this.handleResource2Level(data))

                    }).catch(err => {
                        logger.info(err)
                        reject(err)
                    })
                }else{
                    userRoleRelationService.find({
                        userId:userId
                    }).then(data=>{
                        if(data && data.length>0){
                            let roleId=data[0].roleId;

                            roleResourceRelationService.find({
                                roleId:roleId
                            }).then(data=>{
                                if(data && data.length>0){
                                    let resourceIdArray=data[0].resourceIdArray;

                                    if(resourceIdArray && resourceIdArray.length>0){


                                        this.find({
                                            _id:{
                                                $in:resourceIdArray
                                            }
                                        }).then(data => {

                                            resolve(this.handleResource2Level(data))

                                        }).catch(err => {
                                            logger.info(err)
                                            reject(err)
                                        })


                                    }else{
                                        resolve([])
                                    }
                                }
                            }).catch(err=>{
                                logger.info(err)
                                reject(err)
                            })


                        }else{
                            resolve([])
                        }
                    }).catch(err=>{
                        logger.info(err)
                        reject(err)
                    })
                }


            }).catch(err=>{
                logger.info(err)
                reject(err)
            });

        })
    }


}






module.exports = MainService

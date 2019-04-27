const express = require('express');
const router = express.Router();
const Response = require('../config/response')
const Entity = require('../dao/models/Role')
const RoleResourceEntity = require('../dao/models/RoleResourceRelation')
const mainService = require('../dao/service/RoleService')
const roleResourceService = require('../dao/service/RoleResourceRelationService')
const roleService = require('../dao/service/RoleService')
const userRoleRelationService = require('../dao/service/UserRoleRelationService')
const log4js = require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const entityName='角色'

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
        entity.updateTime=new Date().toLocalDate();

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

    updateObj.updateTime=new Date().toLocalDate()



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

    if(!req.query._id){
        res.send(Response.businessException(`${entityName}ID不能为空`))
    }

    mainService.find(req.query).then(data => {
        if(data && data.length>0){
            res.send(Response.success(data[0]));
        }else{
            res.send(Response.businessException(`未找到对应${entityName}`))
        }


    }).catch(err => {
        logger.info(err)
        res.send(Response.businessException(err))
    })

});

router.get('/getRoleByUserId', function (req, res, next) {

    logger.info(`获取${entityName}根据用户编号的参数：`, req.query)

    if(!req.query.userId){
        res.send(Response.businessException(`用户编号不能为空`))
    }

    userRoleRelationService.find(req.query).then(data => {
        if(data && data.length>0){
            let roleId=data[0].roleId;

            roleService.find({
                _id:roleId
            }).then(data=>{
                if(data && data.length>0){
                    res.send(Response.success(data[0]))
                }else{
                    res.send(Response.success({}))
                }
            })

        }else{
            res.send(Response.success({}))
        }


    }).catch(err => {
        logger.info(err)
        res.send(Response.businessException(err))
    })

});

/**
 * 给角色授权资源
 */
router.post('/auth', function (req, res, next) {

    logger.info(`获取${entityName}授权的参数：`, req.body)

    let roleId=req.body.roleId;


    roleResourceService.find({
        roleId:roleId
    }).then(data => {

        //已有的话更新，否则新增
        if(data && data.length>0){
            data=data[0];
            req.body.updateTime=new Date().toLocalDate();


            roleResourceService.update({
                _id:data._id
            },req.body).then(data=>{
                res.send(Response.success())
            }).catch(err=>{
                res.send(Response.businessException(err))
            })
        }else{

            let entity = new RoleResourceEntity(req.body);
            entity.updateTime=new Date().toLocalDate();


            roleResourceService.save(entity).then(data=>{
                res.send(Response.success())
            }).catch(err=>{
                res.send(Response.businessException(err))
            });

        }


    }).catch(err => {
        logger.info(err)
        res.send(Response.businessException(err))
    })



});



module.exports = router;

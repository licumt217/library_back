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
const entityName = '角色'

// 新增
router.post('/add', async function (req, res) {

    logger.info(`新增${entityName}参数：`, req.body)

    let whereObj = {
        name: req.body.name
    }

    try {
        let data = await mainService.findOne(whereObj);

        if (data) {
            res.send(Response.businessException(`${entityName}已存在！`))
        } else {

            let entity = new Entity(req.body);
            entity.updateTime = new Date().toLocalDate();

            data = await mainService.save(entity)

            res.send(Response.success(data));
        }
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }

})


// 删除
router.post('/remove', async function (req, res) {

    logger.info(`删除${entityName}参数：`, req.body)

    let id = req.body._id

    let whereObj = {
        _id: id
    }

    try {
        let data = await mainService.findOne(whereObj)

        if (!data) {
            res.send(Response.businessException(`${entityName}不存在！`))
        } else {
            await mainService.remove(id);

            res.send(Response.success());

        }
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }


})


// 修改用户信息
router.post('/update', async function (req, res) {

    logger.info(`修改${entityName}信息参数：`, req.body)

    let updateObj = JSON.parse(JSON.stringify(req.body));

    updateObj.updateTime = new Date().toLocalDate()

    let whereObj = {
        _id: req.body._id
    }

    try {
        await mainService.update(whereObj, updateObj);

        res.send(Response.success());
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }
})

router.get('/list', async function (req, res, next) {

    logger.info(`获取${entityName}列表的参数：`, req.query)

    try {
        let data = await mainService.find(req.query);

        res.send(Response.success(data));
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }


});

router.get('/get', async function (req, res, next) {

    logger.info(`获取${entityName}实例的参数：`, req.query)

    if (!req.query._id) {
        res.send(Response.businessException(`${entityName}ID不能为空`))
    }

    try {
        let data = await mainService.findOne(req.query);

        if (data) {
            res.send(Response.success(data));
        } else {
            res.send(Response.businessException(`未找到对应${entityName}`))
        }
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }

});

router.get('/getRoleByUserId', async function (req, res, next) {

    logger.info(`获取${entityName}根据用户编号的参数：`, req.query)

    if (!req.query.userId) {
        res.send(Response.businessException(`用户编号不能为空`))
    }

    try {
        let data = await userRoleRelationService.findOne(req.query);

        if (data) {
            let roleId = data.roleId;

            let whereObj = {
                _id: roleId
            }

            data = await roleService.findOne(whereObj);

            if (!data) {
                data = {}

            }

            res.send(Response.success(data))

        } else {
            res.send(Response.success({}))
        }
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }

});

/**
 * 给角色授权资源
 */
router.post('/auth', async function (req, res, next) {

    logger.info(`获取${entityName}授权的参数：`, req.body)

    let roleId = req.body.roleId;

    let whereObj = {
        roleId: roleId
    }

    try {
        let data = await roleResourceService.findOne(whereObj);

        //已有的话更新，否则新增
        if (data) {

            req.body.updateTime = new Date().toLocalDate();

            whereObj = {
                _id: data._id
            }

            await roleResourceService.update(whereObj, req.body);

            res.send(Response.success())

        } else {

            let entity = new RoleResourceEntity(req.body);
            entity.updateTime = new Date().toLocalDate();


            await roleResourceService.save(entity)

            res.send(Response.success())

        }
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }


});


module.exports = router;

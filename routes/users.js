const express = require('express');
require('../utils/datePrototypeUtils')
const router = express.Router();
const Response = require('../config/response')
const User = require('../dao/models/User')
const Resource = require('../dao/models/Resource')
const UserRoleRelation = require('../dao/models/UserRoleRelation')
const MainService = require('../dao/service/UserService')
const UserRoleService = require('../dao/service/UserRoleRelationService')
const ResourceService = require('../dao/service/ResourceService')
const log4js = require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const md5 = require('md5')
const entityName = '用户'

// 新增
router.post('/add', async function (req, res) {

    logger.info(`新增${entityName}参数：`, req.body)

    let whereObj = {
        username: req.body.username
    }

    try {
        let data = await MainService.findOne(whereObj);

        if (data) {
            res.send(Response.businessException(`${entityName}已存在！`))
        } else {

            let user = new User(req.body);

            data = await MainService.save(user);

            res.send(Response.success(data));
        }
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }

})


// 新增
router.post('/init', async function (req, res) {

    logger.info(`初始化管理员账号等信息参数：`, req.body)

    let whereObj = {
        username: 'sysadmin'
    }

    //初始化资源管理菜单，方便管理员后续操作`
    let resource = new Resource({
        "name": "资源管理",
        "url": "/resource/list",
        "order": 1,
        "activeName": "resource",
        "code": "0001",
        "parentCode": "0",
        "opUserId": 'init'
    })

    let newSysUser = new User({
        username: 'sysadmin',
        type: 2,
        name: '超级管理员'
    })


    try {

        let data = await MainService.findOne(whereObj)

        if (data) {//已存在的话不需要重新新增了

            data = await ResourceService.save(resource)

            res.send(Response.success(data));

        } else {

            await MainService.save(newSysUser)

            data = await ResourceService.save(resource)

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

    let userId = req.body._id

    if (!userId) {
        res.send(Response.businessException(`${entityName}ID不能为空！`))

        return;
    }

    let whereObj = {
        _id: userId
    }

    try {
        let data = await MainService.findOne(whereObj)

        if (data) {

            await MainService.remove(userId)

            res.send(Resource.success())

        } else {
            res.send(Response.businessException(`${entityName}不存在！`))
        }
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }

})

// 登录
router.post('/login', async function (req, res) {

    logger.info(`${entityName}登录参数：`, req.body)

    let username = req.body.username

    let whereObj = {
        username: username
    }

    try {
        let data = await MainService.findOne(whereObj)

        if (data) {

            whereObj.password = req.body.password

            data = await MainService.findOne(whereObj)

            if (data) {
                res.send(Response.success(data));

            } else {
                res.send(Response.businessException(`密码不正确！`))
            }

        } else {
            res.send(Response.businessException(`${entityName}不存在`))
        }
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }


})

/**
 * 不允许修改用户名和密码
 */
router.post('/update', async function (req, res) {

    logger.info(`修改${entityName}信息参数：`, req.body)

    //防止修改
    delete req.body.username;
    delete req.body.password;

    let id = req.body._id;

    if (!id) {
        res.send(Response.businessException(`${entityName}ID不能为空！`));
        return
    }

    let whereObj = {
        _id: id
    }

    let updateObj = JSON.parse(JSON.stringify(req.body));

    try {

        await MainService.update(whereObj, updateObj)

        res.send(Resource.success())

    } catch (err) {

        logger.info(err)
        res.send(Response.businessException(err))

    }

})

/**
 * 更改密码
 */
router.post('/modifyPassword', async function (req, res) {

    logger.info(`更改${entityName}密码参数：`, req.body)

    let updateObj = JSON.parse(JSON.stringify(req.body));

    let whereObj = {
        _id: updateObj._id,
        password: md5(updateObj.password)
    }

    let {password, newPassword, confirmPassword} = updateObj;


    //新密码和原始密码不能相同
    if (password === newPassword) {
        res.send(Response.businessException(`新密码不能和原始密码相同！`))
    }


    //新密码和确认密码必须相同

    if (newPassword !== confirmPassword) {
        res.send(Response.businessException(`新密码和确认密码不相同！`))
    }

    try {
        let data = await MainService.findOne(whereObj)

        if (data) {

            await MainService.update(whereObj, {
                password: md5(newPassword),
                passwordUptTime: new Date().toLocalDate()
            })

            res.send(Response.success());

        } else {
            res.send(Response.businessException(`原密码不正确！`))
        }
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }


})


router.get('/list', async function (req, res, next) {

    logger.info(`获取${entityName}列表的参数：`, req.body)

    try {

        let data = await MainService.find();

        res.send(Response.success(data));

    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }

});

router.post('/findById', async function (req, res, next) {

    logger.info(`获取${entityName}实体的参数：`, req.body)

    let id = req.body._id;

    if (!id) {
        res.send(Response.businessException(`${entityName}ID不能为空！`))
        return
    }

    try {

        let data = await MainService.findById(id)

        res.send(Response.success(data));

    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }

});


/**
 * 给人员授权角色
 */
router.post('/auth', async function (req, res, next) {

    logger.info(`获取${entityName}授权的参数：`, req.body)

    let {userId, roleId} = req.body;

    let whereObj = {
        userId: userId
    }

    try{
        let data = await UserRoleService.findOne(whereObj);

        //已有的话更新，否则新增
        if (data) {

            //none的话删除
            if (roleId === 'none') {

                await UserRoleService.removeByUserId(userId);

                res.send(Response.success())

            } else {

                req.body.updateTime = new Date().toLocalDate();

                whereObj = {
                    _id: data._id
                }

                await UserRoleService.update(whereObj, req.body)

                res.send(Response.success())

            }


        } else {

            let entity = new UserRoleRelation(req.body);

            entity.updateTime = new Date().toLocalDate();


            await UserRoleService.save(entity);

            res.send(Response.success())

        }
    }catch(err){
        logger.info(err)
        res.send(Response.businessException(err))
    }


});


module.exports = router;

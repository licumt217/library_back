const express = require('express');
const router = express.Router();
const Response = require('../config/response')
const Entity = require('../dao/models/Resource')
const mainService = require('../dao/service/ResourceService')
const userService = require('../dao/service/UserService')
const roleResourceRelationService = require('../dao/service/RoleResourceRelationService')
const log4js = require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const entityName = '资源'


// 新增
router.post('/add', async function (req, res) {

    logger.info(`新增${entityName}参数：`, req.body)

    let whereObj = {
        name: req.body.name
    }

    try {
        let data = await mainService.findOne(whereObj);

        if (!data) {
            res.send(Response.businessException(`${entityName}已存在！`))
        } else {
            let entity = new Entity(req.body);

            whereObj = {
                parentCode: req.body.parentCode
            }

            data = await mainService.find(whereObj)

            let theCode = null;

            if (data && data.length > 0) {

                let max = 0;
                let len = data[0].code.length;

                for (let i = 0; i < data.length; i++) {
                    let ele = data[i];
                    if (Number(ele.code) > max) {
                        max = Number(ele.code)
                    }
                }

                theCode = max + 1;

                theCode = String(theCode);

                if (len !== theCode.length) {
                    let len2Fix = len - theCode.length;
                    for (let i = 0; i < len2Fix; i++) {

                        theCode = "0" + theCode;
                    }
                }

            } else {
                theCode = req.body.parentCode.length === 1 ? '0001' : req.body.parentCode + '0001'
            }


            entity.code = theCode;

            entity.activeName = entity.url;

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

    try {
        let data = await mainService.findById(id);

        if (!data) {
            res.send(Response.businessException(`${entityName}不存在！`))
        } else {
            await mainService.remove(id)

            res.send(Response.success());
        }
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }

})


router.post('/update', async function (req, res) {

    logger.info(`修改${entityName}信息参数：`, req.body)

    let updateObj = JSON.parse(JSON.stringify(req.body));

    updateObj.activeName = updateObj.url;

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

    let userId = req.query.userId;

    try {
        let data = await userService.findById(userId);

        let type = data.type;

        //超管返回所有，其它人根据权限获取
        if (type === 2) {

            data = await mainService.find();

            res.send(Response.success(data));

        } else {
            //TODO
        }
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }


});


router.get('/listByLevel', async function (req, res, next) {

    logger.info(`获取${entityName}树形列表的参数：`, req.query)

    let userId = req.query.userId;

    try {
        let data = await mainService.listByLevel(userId);

        res.send(Response.success(data));
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }

});


router.get('/listByRole', async function (req, res, next) {

    logger.info(`获取${entityName}角色授权树形列表的参数：`, req.query)

    let {userId, roleId} = req.query;

    let whereObj = {
        roleId: roleId
    }

    try {
        let allResourceArray = await mainService.listByLevel(userId)

        let data = await roleResourceRelationService.findOne(whereObj)

        if (data) {
            let authResourceIdArray = data.resourceIdArray;


            for (let i = 0; i < authResourceIdArray.length; i++) {

                for (let j = 0; j < allResourceArray.length; j++) {

                    if (allResourceArray[j].children.length === 0) {
                        if (authResourceIdArray[i] === allResourceArray[j]._id.toString()) {
                            allResourceArray[j].checked = true;
                        }
                    } else {
                        for (let m = 0; m < allResourceArray[j].children.length; m++) {
                            if (authResourceIdArray[i] === allResourceArray[j].children[m]._id.toString()) {
                                allResourceArray[j].children[m].checked = true;
                            }
                        }

                    }


                }
            }


        }

        res.send(Response.success(allResourceArray))
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }


});


router.get('/getChildrenAndSelf', async function (req, res, next) {

    logger.info(`获取${entityName}getChildrenAndSelf列表的参数：`, req.query)

    let code = req.query.code;

    let whereObj = {
        code: new RegExp('^' + code)
    }

    try {
        let data = await mainService.find(whereObj);
        res.send(Response.success(data));
    } catch (err) {
        logger.info(err)
        res.send(Response.businessException(err))
    }


});


module.exports = router;

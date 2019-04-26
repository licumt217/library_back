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
const md5=require('md5')
const entityName='用户'

// 新增
router.post('/add', function (req, res) {

    logger.info(`新增${entityName}参数：`,req.body)

    MainService.find({
        username:req.body.username
    }).then(data=>{
        if(data && data.length>0){
            return Promise.reject(`${entityName}已存在！`)
        }else{
            return Promise.resolve()
        }
    }).then(()=>{
        let user = new User(req.body);

        return MainService.save(user).then(data=>{
            res.send(Response.success(data));
        })
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })

})


// 新增
router.post('/init', function (req, res) {

    logger.info(`初始化管理员账号等信息参数：`,req.body)

    MainService.find({
        username:'sysadmin'
    }).then(data=>{
        if(data && data.length>0){
            return Promise.resolve(data[0])
        }else{
            return Promise.resolve()
        }
    }).then((data)=>{

        if(data){
            //初始化资源管理菜单，方便管理员后续操作`
            let resource=new Resource({
                "name":"资源管理",
                "url":"/resource/list",
                "order":1,
                "activeName":"resource",
                "code":"0001",
                "parentCode":"0",
                "opUserId":data._id
            })


            ResourceService.save(resource).then(data=>{
                res.send(Response.success(data));
            }).catch(err=>{
                logger.info(err)
                res.send(Response.businessException(err))
            })
        }else{
            let user = new User({
                username:'sysadmin',
                type:2,
                name:'超级管理员'
            });

            return MainService.save(user).then(data=>{
//初始化资源管理菜单，方便管理员后续操作`
                let resource=new Resource({
                    "name":"资源管理",
                    "url":"/resource/list",
                    "order":1,
                    "activeName":"resource",
                    "code":"0001",
                    "parentCode":"0",
                    "opUserId":data._id
                })


                ResourceService.save(resource).then(data=>{
                    res.send(Response.success(data));
                }).catch(err=>{
                    logger.info(err)
                    res.send(Response.businessException(err))
                })


            })
        }


    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })

})




// 删除
router.post('/remove', function (req, res) {

    logger.info(`删除${entityName}参数：`,req.body)

    let userId=req.body._id


    MainService.find({
        _id:userId
    }).then(data=>{
        if(!data || data.length===0){
            return Promise.reject(`${entityName}不存在！`)
        }else{
            return Promise.resolve()
        }
    }).then(()=>{
        MainService.remove(userId).then(()=>{
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

// 登录
router.post('/login', function (req, res) {

    logger.info(`${entityName}登录参数：`,req.body)

    let username=req.body.username

    let whereObj={
        username:username
    };

    MainService.find(whereObj).then(data=>{

        if(data && data.length>0){

            return Promise.resolve();
        }else{
            return Promise.reject(`${entityName}不存在`);
        }
    }).then(()=>{
        whereObj={
            username:username,
            password:req.body.password
        };

        return MainService.find(whereObj).then(data=>{
            if(data && data.length>0){
                res.send(Response.success(data[0]));

            }else{
                return Promise.reject("密码不正确！")
            }
        })
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })
})

/**
 * 不允许修改用户名和密码
 */
router.post('/update', function (req, res) {

    logger.info(`修改${entityName}信息参数：`,req.body)

    //防止修改
    delete req.body.username;
    delete req.body.password;

    let updateObj=JSON.parse(JSON.stringify(req.body));

    MainService.update({
        _id:updateObj._id
    },updateObj).then(()=>{
        res.send(Response.success());
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    })
})

/**
 * 更改密码
 */
router.post('/modifyPassword', function (req, res) {

    logger.info(`更改${entityName}密码参数：`,req.body)

    let updateObj=JSON.parse(JSON.stringify(req.body));

    let {password,newPassword,confirmPassword}=updateObj;


    //新密码和原始密码不能相同
    if(password===newPassword){
        res.send(Response.businessException(`新密码不能和原始密码相同！`))
    }


    //新密码和确认密码必须相同

    if(newPassword!==confirmPassword){
        res.send(Response.businessException(`新密码和确认密码不相同！`))
    }




    let whereObj={
        _id:updateObj._id,
        password:md5(updateObj.password)
    }

    MainService.find(whereObj).then(data=>{

        if(data && data.length>0){

            return Promise.resolve();
        }else{
            return Promise.reject(`原密码不正确！`);
        }
    }).then(()=>{

        MainService.update(whereObj,{
            password:md5(updateObj.newPassword),
            passwordUptTime: new Date().toLocalDate()
        }).then(()=>{
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

    logger.info(`获取${entityName}列表的参数：`, req.body)

    MainService.find().then(data => {

        res.send(Response.success(data));

    }).catch(err => {
        logger.info(err)
        res.send(Response.businessException(err))
    })

});

router.post('/findById', function (req, res, next) {

    logger.info(`获取${entityName}实体的参数：`, req.body)

    let id=req.body._id;

    MainService.findById(id).then(data => {

        res.send(Response.success(data));

    }).catch(err => {
        logger.info(err)
        res.send(Response.businessException(err))
    })

});


/**
 * 给人员授权角色
 */
router.post('/auth', function (req, res, next) {

    logger.info(`获取${entityName}授权的参数：`, req.body)

    let userId=req.body.userId;
    let roleId=req.body.roleId;


    UserRoleService.find({
        userId:userId
    }).then(data => {

        //已有的话更新，否则新增
        if(data && data.length>0){
            data=data[0];

            //none的话删除
            if(roleId==='none'){
                UserRoleService.remove(userId).then(data=>{
                    res.send(Response.success())
                }).catch(err=>{
                    res.send(Response.businessException(err))
                })
            }else{
                req.body.updateTime=new Date().toLocalDate();


                UserRoleService.update({
                    _id:data._id
                },req.body).then(data=>{
                    res.send(Response.success())
                }).catch(err=>{
                    res.send(Response.businessException(err))
                })
            }



        }else{

            let entity = new UserRoleRelation(req.body);
            entity.updateTime=new Date().toLocalDate();


            UserRoleService.save(entity).then(data=>{
                res.send(Response.success())
            }).catch(err=>{
                console.log(1,err)
                res.send(Response.businessException(err))
            });

        }


    }).catch(err => {
        logger.info(err)
        res.send(Response.businessException(err))
    })



});



module.exports = router;

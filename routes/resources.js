const express = require('express');
const router = express.Router();
const Response = require('../config/response')
const Entity = require('../dao/models/Resource')
const mainService = require('../dao/service/ResourceService')
const userService = require('../dao/service/UserService')
const roleResourceRelationService = require('../dao/service/RoleResourceRelationService')
const log4js = require('../config/log-config')
const logger = log4js.getLogger() // 根据需要获取logger
const entityName='资源'




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


        mainService.find({
            parentCode:req.body.parentCode
        }).then(data=>{
            if(data && data.length>0){

                let max=0;
                let len=data[0].code.length;

                for(let i=0;i<data.length;i++){
                    let ele=data[i];
                    if(Number(ele.code)>max){
                        max=Number(ele.code)
                    }
                }

                console.log('max:'+max)

                let theCode=max+1;

                theCode=String(theCode);

                if(len!==theCode.length){
                    let len2Fix=len-theCode.length;
                    for(let i=0;i<len2Fix;i++){

                        theCode="0"+theCode;
                    }
                }



                return Promise.resolve(theCode)
            }else{
                return Promise.resolve(req.body.parentCode.length===1?'0001':req.body.parentCode+'0001')
            }
        }).then((code)=>{

            entity.code=code;

            entity.activeName=entity.url;

            return mainService.save(entity).then(data=>{
                res.send(Response.success(data));
            })
        }).catch(err=>{
            logger.info(err)
            res.send(Response.businessException(err))
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


router.post('/update', function (req, res) {

    logger.info(`修改${entityName}信息参数：`,req.body)

    let updateObj=JSON.parse(JSON.stringify(req.body));

    updateObj.activeName=updateObj.url;


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

    let userId=req.query.userId;

    userService.findById(userId).then(data=>{

        let user=data

        let type=user.type;

        //超管返回所有，其它人根据权限获取
        if(type===2){
            mainService.find({}).then(data => {
                res.send(Response.success(data));

            }).catch(err => {
                logger.info(err)
                res.send(Response.businessException(err))
            })
        }else{

        }


    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    });




});


router.get('/listByLevel', function (req, res, next) {

    logger.info(`获取${entityName}树形列表的参数：`, req.query)

    let userId=req.query.userId;

    mainService.listByLevel(userId).then(data=>{
        res.send(Response.success(data));
    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    });

});




router.get('/listByRole', function (req, res, next) {

    logger.info(`获取${entityName}角色授权树形列表的参数：`, req.query)

    let {userId,roleId}=req.query;

    mainService.listByLevel(userId).then(allResourceArray=>{

        //获取授权的菜单

        roleResourceRelationService.find({
            roleId:roleId
        }).then(data=>{

            if(data && data.length>0){
                let authResourceIdArray=data[0].resourceIdArray;


                for(let i=0;i<authResourceIdArray.length;i++){

                    for(let j=0;j<allResourceArray.length;j++){

                        if(allResourceArray[j].children.length===0){
                            if(authResourceIdArray[i]===allResourceArray[j]._id.toString()){
                                allResourceArray[j].checked=true;
                            }
                        }else{
                            for(let m=0;m<allResourceArray[j].children.length;m++){
                                if(authResourceIdArray[i]===allResourceArray[j].children[m]._id.toString()){
                                    allResourceArray[j].children[m].checked=true;
                                }
                            }

                        }


                    }
                }

                res.send(Response.success(allResourceArray))
            }else{
                res.send(Response.success(allResourceArray))
            }

        }).catch(err=>{
            res.send(Response.businessException("根据角色获取授权菜单异常！"))
        })




    }).catch(err=>{
        logger.info(err)
        res.send(Response.businessException(err))
    });

});





router.get('/getChildrenAndSelf', function (req, res, next) {

    logger.info(`获取${entityName}getChildrenAndSelf列表的参数：`, req.query)

    let code=req.query.code;

    mainService.find({
        code: new RegExp('^' + code)
    }).then(data => {
        res.send(Response.success(data));

    }).catch(err => {
        logger.info(err)
        res.send(Response.businessException(err))
    })

});







module.exports = router;

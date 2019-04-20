const express = require('express');
const router = express.Router();
const Response = require('../config/response')
const Entity = require('../dao/models/Resource')
const mainService = require('../dao/service/ResourceService')
const userService = require('../dao/service/UserService')
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

                console.log('theCode:'+theCode)
                console.log('len:'+theCode.length,len)



                if(len!==theCode.length){
                    let len2Fix=len-theCode.length;
                    for(let i=0;i<len2Fix;i++){

                        console.log("********")
                        theCode="0"+theCode;
                    }
                }



                return Promise.resolve(theCode)
            }else{
                return Promise.resolve(req.body.parentCode.length===1?'0001':req.body.parentCode+'0001')
            }
        }).then((code)=>{

            console.log(11111111,code)

            entity.code=code;

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

    userService.getById(userId).then(data=>{

        let user=null;
        if(data && data.length>0){
            user=data[0]
        }else{
            res.send(Response.businessException('未找到对应用户'))
        }

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

    userService.getById(userId).then(data=>{

        let user=null;
        if(data && data.length>0){
            user=data[0]
        }else{
            res.send(Response.businessException('未找到对应用户'))
        }

        let type=user.type;

        //超管返回所有，其它人根据权限获取
        if(type===2){
            mainService.find({}).then(data => {

                let dataList=[{
                    name:'借阅管理',
                },{
                    name:'授权管理',
                    children:[{
                        name:'角色管理',
                    },{
                        name:'人员管理',
                        children:[]
                    }]
                }]


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

                console.log('222222,',secondNodeArray)

                for(let i=0;i<returnData.length;i++){
                    let curPNode=returnData[i];
                    for(let j=0;j<secondNodeArray.length;j++){
                        let c=secondNodeArray[j]

console.log('**********',c.parentCode,curPNode.code)

                        if(c.parentCode===curPNode.code){

                            returnData[i].children.push(c)
                            console.log(5555511111,curPNode.children,typeof curPNode.children)
                            console.log(22222,returnData[1])
                        }
                    }
                }




                res.send(Response.success(returnData));

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

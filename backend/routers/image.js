let fs = require('fs');
let express = require('express');
let router = express.Router();
let moment = require('moment');
let path = require('path');
let multer=require('multer');

let MessageModel = require('../models/message');

let storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination(req, file, cb) {
        cb(null, './public/image')
    },
    //给上传文件重命名，获取添加后缀名
    filename(req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, 'image' + '_' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

//添加配置文件到muler对象
let upload = multer({
    storage: storage
});

router.post('/', upload.single('files'), (req, res) => {
    let img = req.file.path.split(path.sep).pop();
    let msg = {
        username: req.body.username,
        avatar: req.body.avatar,
        content: '',
        img: img,
        roomId: req.body.roomId,
        created_at: moment().format('YYYY-MM-DD HH:mm')
    }
    MessageModel.create(msg).then((result) => {
        if(result) {
            res.json({
                status: 1,
                message: '上传图片成功!',
            })
        }
    }).catch( (e) => {
        console.log("error:"+ e);
    })
})

module.exports = router;
let fs = require('fs');
let crypto = require('crypto');
let express = require('express');
let router = express.Router();
let moment = require('moment');
let path = require('path');
let multer=require('multer');

let UserModel = require('../models/user');
let MessageModel = require('../models/message');
let avatars = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg']

let storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination(req, file, cb) {
        cb(null, './public/avatar')
    },
    //给上传文件重命名，获取添加后缀名
    filename(req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, 'avatar' + '_' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

//添加配置文件到muler对象
let upload = multer({
    storage: storage
});

//生成随机盐
const creatSalt = function () {
    var time = Date.now() % 100,
        str = '';
    time = time === 0 ? '00' : String(time);
    for (var i = 0; i < 8; i++) {
        const base = Math.random() < 0.5 ? 65 : 97;
        str += String.fromCharCode(
            base +
            Math.floor(
                Math.random() * 26
            )
        );
    }
    return time + str;
}
const md5 = (text) => {
    return crypto.createHash("md5").update(String(text)).digest("hex");
}
const encrypt = (password, salt) => {
    return md5(md5(password) + salt);
}

//检查用户是否保存登录cookie
router.get('/',function (req,res) {
    let username;
    if(!req.session.user) {
        res.json({
            isLogin: false,
            message: '不存在登录session!',
            result: {}
        })
    } else {
        username = req.session.user.username;
        UserModel.getUserByName(username).then(function (result) {
            var user = result;
            user.password = '';
            user.salt = '';
            res.json({
                isLogin: true,
                message: '存在登录session!',
                result: result
            })
        }).catch(function (e) {
            console.log("error:"+ e);
        });
    }
});

//注册
router.post('/', (req,res) => {
    let username = req.body.user.username;
    let password = req.body.user.password;
    let avatars = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg']
    let ranNum, salt, newUser;
    UserModel.getUserByName(username).then((result) => {
        if(result){
            res.json({
                status: 0,
                message: '"' + username + '" 已经存在!'
            })
        } else {
            salt = creatSalt();
            password = encrypt(password, salt);
            ranNum = Math.floor(Math.random() * 7);
            newUser = {
                username: username,
                password: password,
                salt: salt,
                avatar: avatars[ranNum],
                created_at: moment().format('YYYY-MM-DD HH:mm')
            };
            UserModel.create(newUser).then( (result) =>{
                let user = {
                    username: result.username,
                    bio: result.bio,
                    avatar: result.avatar
                };
                req.session.user = user;
                res.json({
                    status: 1,
                    message: '注册成功!',
                    result: user
                })
            }).catch( (e) => {
                console.log("error:"+ e);
            })
        }
    }).catch( (e) => {
        console.log("error:"+ e);
    });
});

//登陆
router.post('/session', (req,res) => {
    let username = req.body.user.username;
    let password = req.body.user.password;
    UserModel.getUserByName(username).then((result) => {
        console.log("mongod进得去");
        if(!result){
            res.json({
                status: 0,
                message: '"' + username + '" 用户不存在!'
            })
        } else{
            password = encrypt(password, result.salt);
            if ( password !== result.password ) {
                res.json({
                    status: 0,
                    message: '密码错误!'
                })
            } else {
                let user = {
                    username: result.username,
                    bio: result.bio,
                    avatar: result.avatar
                };
                req.session.user = user;
                res.json({
                    status: 1,
                    message: '登陆成功！',
                    result: user
                });
            }
        }
    })
})

//登出
router.delete('/session',function (req,res) {
    req.session.user = null;
    res.json({
        status: 1,
        message: '注销成功！',
    });
})

//更新用户头像文件
router.put('/avatar', upload.single('files'), (req, res) => {
    let newAvatar = req.file.path.split(path.sep).pop();
    let username = req.body.username;
    let bio = req.body.bio;
    let updatedData = {
        avatar: newAvatar
    }
    UserModel.getUserByName(username).then((result) => {
        if(avatars.indexOf(result.avatar) === -1) {
            fs.unlink( 'public/avatar/' + result.avatar, (err) => {
                if(err){
                    throw err;
                }
            });
        }
        return result;
    }).then((result) => {
        UserModel.update(username, updatedData).then((result) => {
            MessageModel.update(username, updatedData).then((result) => {
                res.json({
                    status: 1,
                    message: '头像更换成功!',
                    result: {
                        username: username,
                        bio: bio,
                        avatar: newAvatar
                    }
                })
            }).catch(function (e) {
                console.log("error:"+ e);
            });
        }).catch(function (e) {
            console.log("error:"+ e);
        });
    }).catch(function (e) {
        console.log("error:"+ e);
    });
})

module.exports = router;
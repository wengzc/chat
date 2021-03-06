let path = require('path');
let express = require('express');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let config = require('config-lite')(__dirname);
let bodyParser = require('body-parser')
let routers = require('./routers');
let socket = require('./websocket')
let pkg = require('./package');

let app = express();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

//使用body-parser中间件
app.use(bodyParser.json());

// 设置cors跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");   //设置跨域访问
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With');
    res.header("Content-Type", "application/x-www-form-urlencoded");
    next();
});

// session 中间件
app.use(session({
    name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true,// 强制更新 session
    saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new MongoStore({// 将 session 存储到 mongodb
        url: config.mongodb// mongodb 地址
    })
}));

// 路由
routers(app);

// 监听端口，启动程序
let server = app.listen(config.port, () => {
    console.log(`${pkg.name} listening on port ${config.port}`);
});
socket(server);
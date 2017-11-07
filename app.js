//引入express框架
var express = require("express");
//引入路由
var router = require("./controller/route.js");
var app = express();
//设置模板引擎
app.set("view engine","ejs");

//设置静态资源库路径
app.use(express.static("./public/"));
app.use(express.static("./uploads/"));

//路由地址设置
app.get("/",router.showIndex);

/**
 *  /:photoName 路径参数  
 *  用 req.params[photoName] 来获取
 */
app.get("/:photoName",router.showPhoto);

//路由上传图片
app.get("/up",router.showUp);
app.post("/up",router.doPost);

//路由设置错误页面
app.use(function(req,res){
    res.render("err");
});

//端口设置
app.listen(3004,function(){
    console.log('服务器已经运行在3004端口');
});

/*
不要把所有业务都写在一个文件当中，这样子即算不运行代码本身，但是也占用了加载打开的速度
*/
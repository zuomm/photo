//路由只是方法的罗列，具体的业务实现由module实现
//../先跳出到上一级目录
var file = require("../modules/files.js"),
    fs = require("fs"),
    path = require("path"),
    formidable = require('formidable'),
    util = require('util'),
    sd = require("silly-datetime");//引入时间模块


//node的模块语法exports
exports.showIndex = (req,res,next)=>{
    //读取所有的文件夹
    //逻辑判断写在file.js里面，这里只是调用,参数是回调函数传过来的
    var allFolders = file.getAllAlbums((allAlbums)=>{
        //页面渲染 express模板引擎 npm install --save ejs
        res.render("index",{
           "allAlbums":allAlbums 
        })
        //“index.ejs” 会被渲染为 HTML。
    });
}

exports.showPhoto = (req,res,next)=>{
    //获取点击的是哪个相册,同时点击相册图片也是用此方法
    var photoName = req.params["photoName"];//获取路由参数
    console.log(photoName);
    file.getAllImagesByPhotoName(photoName,(err,imagesArr)=>{//(null,allImages)
        if(err){
            next();//交给下面的中间件处理
            return;
        }
        res.render("photo",{
            "photoName":photoName,
            "images":imagesArr
        });
    })
}

exports.showUp = (req,res,next)=>{
    var allFolders = file.getAllAlbums(function(allFolders){
        res.render("up",{
            allAlbums:allFolders
        });
    });
}
/**
 * 上传图片插件：formidables 
 * 参考地址：https://www.npmjs.com/package/formidable
 * form标签上加格式 enctype="multipart/form-data" 就可以上传图片了
 */
exports.doPost = (req,res)=>{
    // parse a file upload 
    var form = new formidable.IncomingForm();

    //在parse之前设置上传路径，也就意味着可能没有接受到请求
    /*
        解决方案：
        先设置一个默认的目录，然后等接受到表单数据之后，再移动到
        表单数据中指定的目录下
    */
    console.log(`__dirname：${__dirname}`);//打印：photo/controller

    form.uploadDir = path.normalize(__dirname + '/../tempup');
    console.log(`form.uploadDir：${form.uploadDir}`);
    /**
     * 打印：photo/tempup 
     * __dirname + '/../tempup' ：表示先找到当前文件夹目录然后跳出来上一级目录再到tempup目录
     */
    
    //当到parse的时候，就已经接受到请求了

    form.parse(req, function(err, fields, files,next) {
        // res.writeHead(200, {'content-type': 'text/plain'});
        // res.write('received upload:\n\n');
        // res.end(util.inspect({fields: fields, files: files}));
        if(err){
            next();
            return;
        }
        var size = parseInt(files.uploadfile.size/1024);//上传图片大小
        console.log(files.uploadfile.size);
        console.log(size);
        if(size > 2000){
            res.send("图片太大，应该小于1M");//此时已经上传了
            fs.unlink(files.uploadfile.path);//删除已经上传的图片
            return;
        }
        var newDate = sd.format(new Date(),"YYYYMMDDHHmmss");
        var random = parseInt(Math.random()*89999+10000);//10000-99999 五位数的随机数
        var extname = path.extname(files.uploadfile.name);//获取文件后缀

        var folder = fields.folderName;//拿到指定的文件夹名称   select的name

        var oldpath = files.uploadfile.path;
        //   ../表示切换到上一级目录
        var newpath = path.normalize(__dirname + '/../uploads/'+ folder + '/'+ newDate+random+extname);
        console.log("当前路径：" + __dirname);
        console.log("旧的路径：" + oldpath);
        console.log("新的路径：" + newpath);
        //修改文件名称
        fs.rename(oldpath,newpath,(err)=>{
            if(err){
                res.send("改名失败了");//res.redirect("/")
                return;
            }
            res.send("成功");
        })
    });
}
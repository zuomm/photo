/**
 * //文件处理业务（脏活累活）
 */
var fs = require("fs");
/*
由于还没有学数据库的原因，所以数据只是通过读取文件夹的形式来获取的，
但是操作的代码都是接近的
*/

/*
    为什么要用回调函数：
    回调函数，因为读取文件是异步的，根本不知道啥时候请求完成，
    请求完成后需要用回调函数处理业务逻辑
*/
exports.getAllAlbums = (callback)=>{
    /**
     * 1.读取目录的内容  
     *   异步执行: fs.readdir(path[, options], callback)
     *   回调有两个参数 (err, files)，
     *      其中 files 是目录中不包括 '.' 和 '..' 的文件名的数组。
     */
    //
    fs.readdir("./uploads",function(err,files){
        if(err){
            throw err;
            return;
        }
        var allAlbums = [];
        //files数组遍历
        // console.log(files);

        // 报错了 files.forEach() is not a function
        // files.forEach(function(element, index, array){
        //     console.log(element);
        //     console.log(index);
        //     console.log(array);
        // })
        // files.forEach(function(element, index, array){
        //     if(index == array.length){
        //         console.log(index);
        //         console.log(array.length);
        //         //结束了
        //         callback && callback(allAlbums);
        //         return;//所有的除了报错可以不写也没关系，其他的时候一定记得加上
        //     }
        //     fs.stat("./uploads/" + element,function(err,stats){
        //         if(err){
        //             throw err;//找不到文件了
        //         }
        //         if(stats.isDirectory()){
        //             allAlbums.push(element);
        //         }
        //     }); 
        // });
        //for循环页面出现挂载现象
        // for(let i = 0; i < files.length;i++ ){//形参
        //     debugger;
        //     console.log(i);
        //     if(i == files.length){
        //         //结束了
        //         callback && callback(allAlbums);
        //         return;//所有的除了报错可以不写也没关系，其他的时候一定记得加上
        //     }
        //     fs.stat("./uploads/" + files[i],function(err,stats){
        //         debugger;
        //         if(err){
        //             throw err;//找不到文件了
        //         }
        //         if(stats.isDirectory()){
        //             debugger;
        //             allAlbums.push(files[i]);
        //         }
        //         // iterator(i+1);
        //     });
        // };
        // return allAlbums;
        (function iterator(i){//形参
            if(i == files.length){
                //结束了
                callback(allAlbums);
                return;//所有的除了报错可以不写也没关系，其他的时候一定记得加上
            }
            fs.stat("./uploads/" + files[i],function(err,stats){
                if(err){
                    throw err;//找不到文件了
                }
                if(stats.isDirectory()){
                    allAlbums.push(files[i]);
                }
                iterator(i+1);
            });
        })(0);
    });
}
/**
 * two params：
 * photoName ：相册的名称
 * callback ：回调函数
 */
exports.getAllImagesByPhotoName = (photoName,callback)=>{
    
    fs.readdir(`./uploads/${photoName}`,(err,files)=>{//files 文件名数组
        if(err){
            callback("没有找到Uploads文件",null);
            return;
        }
        var allImages = [];
        (function iterator(i){//形参
            if(i == files.length){
                //结束
                callback(null,allImages);//null返回的报错信息
                return;
            }
            //uploads/当前点击的“相册文件夹”/相册文件
            fs.stat(`./uploads/${photoName}/${files[i]}`,(err,stats)=>{
                if(err){
                    callback("找不到文件"+files[i],null);
                    return;
                }
                /*
                    如果需要整个全部显示，那么你判断是否是图片或文件夹，
                    如果二者满足其一，则push到allImages数组，
                */
                if(stats.isFile()){
                    allImages.push(files[i]);
                }
                iterator(i+1);//读取完成后接着去读下一个，因为是异步读取
            })
        })(0);
    });
}


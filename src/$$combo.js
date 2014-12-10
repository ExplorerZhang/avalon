//合并脚本
var fs = require("fs")
var path = require("path") //不同的操作系统，其 文件目录 分割符是不一样的，不能直接使用 + "/"来实现
var curDir = process.cwd() //当前目录
var otherDir = curDir.replace(/avalon[\/\\]src/, "")
var Buffer = require('buffer').Buffer
var now = new Date
var version = "1.3.7.3"
var date = now.getFullYear() + "." + now.getMonth() + "." + now.getDate()
function directive(name) {
    return path.join("15 directive", name)
}

function comboFiles(files, writer, lastCallback, statement) {

    return function callback() {
        var fileName = files.shift()

        if (!fileName) {
            lastCallback()
            return
        }
        var filePath = path.join(curDir, fileName + ".js")
        var readable = fs.createReadStream(filePath)
        if (fileName === "00 inter") {
            readable.on("data", function(chunk) {
                var str = chunk.toString("utf8")
                var offset = (new Buffer(str.slice(0, str.indexOf("!!")), "utf8")).length
                chunk.write(statement, offset)
            })
        }
        readable.pipe(writer, {end: false})
        readable.on("readable", function() {
            writer.write("\n")
            console.log("add " + filePath)
        })
        readable.on("end", callback)
    }
}
//avalon.js 所需要合并的子文件
var compatibleFiles = [
    "00 inter", "01 variable", "01 variable.share", "02 core", "03 es5.shim",
    "04 dom.polyfill", "05 configuration", "06 EventBus", "06 findNodes",
    "07 modelFactory", "07 modelFactory.shim", "08 Collection", "09 dispatcher",
    "10 HTML", "12 scan", "12 scanTag", "12 scanNode", "12 scanAttr", "12 scanText",
    "13 dom", "14 parser", "14 parser.share",
    directive("skip"), directive("controller"), directive("important"),
    directive("attr"), directive("include"), directive("class.hover.active"), directive("data"),
    directive("text"), directive("html"), directive("if"), directive("visible"), directive("on"),
    directive("widget"), directive("duplex.1"), directive("duplex.2"),
    directive("duplex.3"), directive("repeat.each.with"),
    "16 filter", "17 loader", "18 domReady", "19 outer"
]
//avalon.modern.js 所需要合并的子文件
var modernFiles = [
    "00 inter", "01 variable.modern", "01 variable.share", "02 core.modern",
    "04 dom.polyfill.modern", "05 configuration", "06 EventBus", "06 findNodes.modern",
    "07 modelFactory", "08 Collection", "09 dispatcher", "10 HTML.modern",
    "12 scan", "12 scanTag", "12 scanNode", "12 scanAttr.modern", "12 scanText",
    "13 dom.modern", "14 parser.modern", "14 parser.share",
    directive("skip"), directive("controller"), directive("important"),
    directive("attr"), directive("include"), directive("class.hover.active"), directive("data"),
    directive("text.modern"), directive("html"), directive("if"), directive("visible"), directive("on"),
    directive("widget"), directive("duplex.1"), directive("duplex.2.modern"),
    directive("duplex.3"), directive("repeat.each.with"),
    "16 filter", "17 loader", "18 domReady.modern", "19 outer"
]
//avalon.shim.js 所需要合并的子文件
var shimFiles = [
    "00 inter", "01 variable", "01 variable.share", "02 core", "03 es5.shim",
    "04 dom.polyfill", "05 configuration", "06 EventBus", "06 findNodes",
    "07 modelFactory", "07 modelFactory.shim", "08 Collection", "09 dispatcher",
    "10 HTML", "12 scan", "12 scanTag", "12 scanNode", "12 scanAttr", "12 scanText",
    "13 dom", "14 parser", "14 parser.share",
    directive("skip"), directive("controller"), directive("important"),
    directive("attr"), directive("include"), directive("class.hover.active"), directive("data"),
    directive("text"), directive("html"), directive("if"), directive("visible"), directive("on"),
    directive("widget"), directive("duplex.1"), directive("duplex.2"),
    directive("duplex.3"), directive("repeat.each.with"),
    "16 filter", "18 domReady.noop", "19 outer"
]
//avalon.repeat.js 所需要合并的子文件
var repeatFiles = [
    "00 inter", "01 variable", "01 variable.share", "02 core", "03 es5.shim",
    "04 dom.polyfill", "05 configuration", "06 EventBus", "06 findNodes",
    "07 modelFactory.repeat", "07 modelFactory.shim", "08 Collection.repeat", "09 dispatcher",
    "10 HTML", "12 scan", "12 scanTag", "12 scanNode", "12 scanAttr", "12 scanText",
    "13 dom", "14 parser", "14 parser.repeat",
    directive("skip"), directive("controller"), directive("important"),
    directive("attr"), directive("include"), directive("class.hover.active"), directive("data"),
    directive("text"), directive("html"), directive("if"), directive("visible"), directive("on"),
    directive("widget"), directive("duplex.1"), directive("duplex.2"),
    directive("duplex.3"), directive("repeat2"),
    "16 filter", "17 loader", "18 domReady", "19 outer"
]

var writable = fs.createWriteStream(path.join(curDir, 'avalon.js'), {
    encoding: "utf8"
});
writable.setMaxListeners(100) //默认只有添加11个事件，很容易爆栈
var comboCompatibleFiles = comboFiles(compatibleFiles, writable, function() {
    //更新avalon.test中的文件
    var readable3 = fs.createReadStream(path.join(curDir, 'avalon.js'))
    var writable3 = fs.createWriteStream(path.join(otherDir, 'avalon.test', "src", "avalon.js"))
    readable3.pipe(writable3)
}, "avalon.js " + version + " build in " + date + " \n")
comboCompatibleFiles()


var writable2 = fs.createWriteStream(path.join(curDir, 'avalon.modern.js'), {
    encoding: "utf8"
})
writable2.setMaxListeners(100) //默认只有添加11个事件，很容易爆栈

var comboModernFiles = comboFiles(modernFiles, writable2, function() {
    //更新avalon.test中的文件
    var readable3 = fs.createReadStream(path.join(curDir, 'avalon.modern.js'))
    var writable3 = fs.createWriteStream(path.join(otherDir, 'avalon.test', "src", "avalon.modern.js"))
    readable3.pipe(writable3)
}, "avalon.modern.js " + version + " build in " + date + " \n")
comboModernFiles()


var writable3 = fs.createWriteStream(path.join(curDir, 'avalon.shim.js'), {
    encoding: "utf8"
})
writable3.setMaxListeners(100) //默认只有添加11个事件，很容易爆栈

var comboShimFiles = comboFiles(shimFiles, writable3, function() {
    //更新avalon.test中的文件
    console.log("end!")
}, "avalon.shim.js(去掉加载器与domReady) " + version + " build in " + date + " \n")


comboShimFiles()



var writable4 = fs.createWriteStream(path.join(curDir, 'avalon.repeat.js'), {
    encoding: "utf8"
})
writable4.setMaxListeners(100) //默认只有添加11个事件，很容易爆栈

var comboRepeatFiles = comboFiles(repeatFiles, writable4, function() {
    //更新avalon.test中的文件
    var readable4 = fs.createReadStream(path.join(curDir, 'avalon.repeat.js'))
    var writable4 = fs.createWriteStream(path.join(otherDir, 'avalon.test', "src", "avalon.repeat.js"))
    readable4.pipe(writable4)
}, "avalon.repeat.js(ms-repeat升级版) " + version + " build in " + date + " \n")


comboRepeatFiles()

var mobileFiles = [
    "00 inter", "01 variable.modern", "01 variable.share", "02 core.modern",
    "04 dom.polyfill.modern", "05 configuration", "06 EventBus", "06 findNodes.modern",
    "07 modelFactory.repeat", "08 Collection.repeat", "09 dispatcher", "10 HTML.modern",
    "12 scan", "12 scanTag", "12 scanNode", "12 scanAttr.modern", "12 scanText",
    "13 dom.modern", "14 parser.modern", "14 parser.repeat",
    directive("skip"), directive("controller"), directive("important"),
    directive("attr"), directive("include"), directive("class.hover.active"), directive("data"),
    directive("text.modern"), directive("html"), directive("if"), directive("visible"), directive("on"),
    directive("widget"), directive("duplex.1"), directive("duplex.2.modern"),
    directive("duplex.3"), directive("repeat2"),
    "16 filter", "20 fastclick", "17 loader", "18 domReady.modern", "19 outer"
]


new function() {
    var writable4 = fs.createWriteStream(path.join(curDir, 'avalon.mobile.js'), {
        encoding: "utf8"
    })
    writable4.setMaxListeners(100) //默认只有添加11个事件，很容易爆栈

    var comboMobileFiles = comboFiles(mobileFiles, writable4, function() {
        //更新avalon.test中的文件

    }, "avalon.mobile.js(用于手机与触屏设备) " + version + " build in " + date + " \n")


    comboMobileFiles()
}

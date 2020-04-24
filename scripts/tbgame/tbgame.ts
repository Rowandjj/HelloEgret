import * as fs from 'fs';
import * as path from 'path';
var execSync = require('child_process').execSync;
const crypto = require('crypto');
declare module "fs" {
    export function copyFileSync(oldPath: string, newPath: string): void;
}
export class TBGamePlugin implements plugins.Command {
    static removedFile: Array<String> = [
        "libs/modules/promise/promise.js",
        "libs/modules/promise/promise.min.js",
        "libs/modules/egret/egret.js",
        "libs/modules/egret/egret.min.js",
    ];
    static resFile: Array<String> = [
        "libs/modules/res/res.js",
        "libs/modules/res/res.min.js",
        "libs/modules/RES/RES.js",
        "libs/modules/RES/RES.min.js",
        "libs/modules/assetsmanager/assetsmanager.min.js",
        "libs/modules/assetsmanager/assetsmanager.js",
    ];
    constructor() {

    }
    md5Obj = {}
    useRes: boolean = false
    md5(content) {
        let md5 = crypto.createHash('md5');
        return md5.update(content).digest('hex');
    }
    async onFile(file: plugins.File) {
        if (file.extname != '.js') {
            return file;
        }
        const filename = file.origin;
        if (filename == 'manifest.js') {
            return file;
        }
        if (TBGamePlugin.removedFile.indexOf(filename) > -1) {
            file.contents = new Buffer("");
            return file;
        } else if (TBGamePlugin.resFile.indexOf(filename) > -1) {
            file.contents = new Buffer("");
            this.useRes = true;
            return file;
        } else {
            let inject_string = `
            var __reflect = (this && this.__reflect) || function (p, c, t) {
                p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
            };
            var __extends = this && this.__extends || function __extends(t, e) { 
            function r() { 
                this.constructor = t;
            }
            for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                r.prototype = e.prototype, t.prototype = new r();
            };
            var global = $global;
            var window = global.window;
            var navigator = window.navigator;
            var egret = window.egret;
            var eui = window.eui;
            var generateEUI = window.generateEUI || {};
            var RES = window.RES;
            var dragonBones = window.dragonBones;
            var Main = $global.Main;
            var document = window.document;
            var navigator = global.navigator;
            `;
            let content = file.contents.toString();
            if (filename == "libs/modules/eui/eui.js" || filename == 'libs/modules/eui/eui.min.js') {
                content += ";window.eui = eui;"
            }
            if (filename == 'libs/modules/dragonBones/dragonBones.js' || filename == 'libs/modules/dragonBones/dragonBones.min.js') {
                content += ';window.dragonBones = dragonBones';
            }
            content = inject_string + content;
            if (filename == 'main.js' || filename == 'main.min.js') {
                content += "\n;$global.Main = Main;"
            }
            this.md5Obj[path.basename(filename)] = this.md5(content)
            file.contents = new Buffer(content);
            return file;
        }


    }
    async onFinish(pluginContext: plugins.CommandContext) {
        let { outputDir } = pluginContext;
        let templatePath = __dirname + '/../Template'

        this.copyDir(templatePath, outputDir)

        let cmd = "";
        if (this.useRes) {
            const indexJSPath = path.join(outputDir, '/pages/index/index.js');
            let fileContent = fs.readFileSync(indexJSPath);
            fileContent = `  require("../../node_modules/@tbminiapp/egret-res/res.js"); \n` + fileContent;
            fs.writeFileSync(indexJSPath, fileContent);
            cmd = `(cd ${outputDir} && npm i @tbminiapp/egret-appx-component @tbminiapp/egret-res --by=yarn --save )`;
        } else { 
            cmd = `(cd ${outputDir} && npm i @tbminiapp/egret-appx-component --by=yarn --save )`;
        }
    
        let result = execSync(cmd);
        result = String(result)
        console.log(result)

    }

    readData(filePath: string): any {
        return JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));
    }
    writeData(data: Object, filePath: string) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, "\t"));
    }
    deleteFolder(path) {
        let files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                let curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                    this.deleteFolder(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }

    }
    _copy(src: string, dist: string) {
        var paths = fs.readdirSync(src)
        paths.forEach((p) => {
            var _src = src + '/' + p;
            var _dist = dist + '/' + p;
            var stat = fs.statSync(_src)
            if (stat.isFile()) {// 判断是文件还是目录
                fs.writeFileSync(_dist, fs.readFileSync(_src));
            } else if (stat.isDirectory()) {
                this.copyDir(_src, _dist)// 当是目录是，递归复制
            }
        })
    }
    /*
    * 复制目录、子目录，及其中的文件
    * @param src {String} 要复制的目录
    * @param dist {String} 复制到目标目录
    */
    copyDir(src: string, dist: string) {
        var b = fs.existsSync(dist)
        // console.log("dist = " + dist)
        if (!b) {
            // console.log("mk dist = ", dist)
            this.mkdirsSync(dist);//创建目录
        }
        // console.log("_copy start")
        this._copy(src, dist);
    }
    mkdirsSync(dirname: string) {
        if (fs.existsSync(dirname)) {
            return true;
        } else {
            if (this.mkdirsSync(path.dirname(dirname))) {
                // console.log("mkdirsSync = " + dirname);
                fs.mkdirSync(dirname);
                return true;
            }
        }
    }


}

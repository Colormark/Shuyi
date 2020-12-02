const _remote = require('electron').remote
const _path = require('path')
const _fse = require('fs-extra')
const _dialog = _remote.dialog
const _dialogs = require('electron-dialogs').renderer('dialogs')
const _tray = _remote.Tray
const __srcdir = _path.resolve(__dirname, '..')

// Initial Proj
let _RecentData;
let _AppDataPath;
let _AppDataFile;
const AppDataFolder = "com.Kindling.WhiteFeather";

$(function(){

    _AppDataPath = _path.join(_remote.app.getPath("appData"),AppDataFolder);

    _fse.ensureDirSync(_AppDataPath, err => {
        console.log(err);
    });

    _AppDataFile = _path.join(_AppDataPath, "recents.json")
    _fse.ensureFileSync(_AppDataFile)

    _Recents = _fse.readJsonSync(_AppDataFile , { throws: false });
    if(_Recents==null || !_Recents.hasOwnProperty("history")){
        _Recents = { "history":[] };
        saveRecents();
    }

})
function saveRecents(callback){
    _fse.writeJsonSync(_AppDataFile, _Recents);
    if(typeof callback === 'function'){
        callback();
    }
}

function alert(title, type){
    var type = type?type:"info";
    const iconPath = _path.join(__dirname,'..','assets','icons', type+'_48.png');
	// console.log(jetpack.exists(iconPath)); //should be "file", otherwise you are not pointing to your icon file 
    // let nimage = _remote.nativeImage.createFromPath(iconPath);
    // nimage = nimage.resize({ width: 16, height: 16 });
    // appIcon = new _tray(nimage);

    _dialog.showMessageBox({
        "type": type,
        "title": "消息",
        "message": title,
        "icon": iconPath,
        "buttons":['好']
    },(index) => {
        if ( index == 0 ) {
            console.log('You click');
        }
    })
}


function goback() {
    window.history.go(-1);
}

function goto(page){
    window.location.href = page;
}

function notice(title, subtitle, type) {

    // if(!_dialog){
    //     _dialog = require('electron-dialog')
    // }
    alert(title+"\n"+subtitle);
}

function formatUTF8ToJson(bin) {
    //utf-8分有dom版和无dom版,解决办法是先将读到的文件转成二进制，然后检索dom符号删除
    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
        bin = bin.slice(3);
    }
    return JSON.parse(bin.toString('utf-8'));
}

function isFilenameValid(filename) {
    const Regi = /^(?!\.)[^\\\/:\*\?"<>\|]{1,255}$/;
    if (Regi.test(filename)) {
        return true;
    } else {
        return false;
    }
}
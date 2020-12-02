const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = require('electron').ipcMain
const path = require('path')
const isDev = require('electron-is-dev')
const dialogs = require('electron-dialogs').main

const appMenu = require('./appMenu')

const __srcdir = path.resolve(__dirname, '..')

let mainWindow

const createWindow = () => {
    var electronScreen = electron.screen
    var size = electronScreen.getPrimaryDisplay().workAreaSize

    let opt = {
      show: false,
      backgroundColor: '#282c34',
      width: size.width,
      height: size.height,
      titleBarStyle: 'hidden',
      darkTheme : true,
      center: true,
      minWidth: 800,
      minHeight: 660,
      webPreferences: {
        devTools: isDev,
        // preload: path.join(__srcdir,'/renderer/preload.js'),
        plugins: true, 
        nodeIntegration: true,
        webSecurity: false
      }
    };

    if (process.platform === 'win32') {
      opt["icon"] = path.join(__srcdir,'/assets/icons/logo.ico')
    }
    
    mainWindow = new BrowserWindow(opt)
  
    // and load the index.html of the app.
    mainWindow.loadFile('./src/renderer/_index.html')

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindow.once('ready-to-show', () => {
      mainWindow.show()
    })

    // create the application's menu
    appMenu()

    if(isDev){
      electron.globalShortcut.register("CmdOrCtrl+Shift+P", () => {
        if (mainWindow) {
          mainWindow.webContents.toggleDevTools();
        }
      })
   }
}

dialogs(mainWindow, 'dialogs')

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})


//get cmd from render
ipcMain.on('getCmd', (event, arg) => {

    
})


// zipper/unzipper
// var zip;
// ipcMain.on('zipFolder', function (event, arg) {
//   getZip().zipFolder(arg.folderToZip, arg.zippedFilePath, function () {
//     mainWindow.webContents.send('master-process-callback', { callbackId: arg.callbackId });
//   });
// });
// ipcMain.on('unzip', function (event, arg) {
//   getZip().unzip(arg.zippedFilePath, arg.destinationFolder, function() {
//     mainWindow.webContents.send('master-process-callback', { callbackId: arg.callbackId });
//   });
// });
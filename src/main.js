const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const treeLoader = require('./threeloader.js');
const generateXML =  require('./generateXML.js');
let mainWindow;

app.on('ready', _=> {
  mainWindow = new BrowserWindow();
  mainWindow.loadURL(`file://${__dirname}/../views/navigation.html`);
  ipc.on('load_tree_data', _=> {
    treeLoader(json => {
      mainWindow.webContents.send('jsondata', json);
    });
  })

  ipc.on('generateXML', (event, jsondata) => {
    generateXML(jsondata);
  })

  mainWindow.on('closed', _=>{
    console.log("closed");
    mainWindow = null;
  })
})


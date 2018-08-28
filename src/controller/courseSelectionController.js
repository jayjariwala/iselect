const electron = require('electron');
const BrowserWindow = require('electron').BrowserWindow;
const treeLoader = require('../middleware/treeloader.js');
const generateXML = require('../middleware/generateXML.js');
const generateJS = require('../middleware/generateJSFrame.js');
const fetchHtmlFrame = require('../middleware/fetchHtmlFrame.js');
const ipc = electron.ipcMain;

module.exports = function () {
    let mainWindow = new BrowserWindow({
        width: 1080,
        height: 800,
    });
    mainWindow.loadURL(`file://${__dirname}/../views/navigation.html`);
    ipc.on('load_tree_data', _ => {
        //callback hell :D :S  refector => async/await
        treeLoader(json => {
            mainWindow.webContents.send('jsondata', json);
            fetchHtmlFrame(html5fetch => {
                //  do stuff in here
                mainWindow.webContents.send('html5json', html5fetch);
            });
        });
    })
    ipc.on('generateXML', (event, jsondata) => {
        generateXML(jsondata);
    })
    ipc.on('generateJS', (event, jsondata) => {
        generateJS(jsondata);
    })
}
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
        treeLoader(xmljson => {
            fetchHtmlFrame(html5json => {
                mainWindow.webContents.send('sendData', html5json, xmljson);
            });
        });
    })

    ipc.on('generateNavBar', (event, newXmlNavBar, newHtmlNavBar) => {
        generateXML(newXmlNavBar);
        generateJS(newHtmlNavBar);
    })
}
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const courseSelectionController = require('../controller/courseSelectionController');

module.exports = function () {
  let splashWindow = new BrowserWindow({
    width: 500,
    height: 300,
  });

  splashWindow.loadURL(`file://${__dirname}/../views/splash.html`);

  ipc.on('splash_timeout', _ => {
    courseSelectionController();
    splashWindow.close();
  });

  splashWindow.on('closed', _ => {
    splashWindow = null;
  })

};
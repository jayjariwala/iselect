const fs = require('fs');
const electron = require('electron');
const ipc = electron.ipcRenderer;

function splashTimeout() {
  ipc.send('splash_timeout');
}

setTimeout(splashTimeout, 3000);
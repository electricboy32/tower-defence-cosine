const { app, BrowserWindow } = require('electron');
const path = require('path');

app.setName('Military Tower Defence');

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

function createWindow () {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // absolute path → file://… URL
  const startPage = path.resolve(__dirname, 'index.html');
  win.loadURL('file://' + startPage);
}

app.whenReady().then(createWindow);
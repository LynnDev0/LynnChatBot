const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

let apiKey = '';

function loadConfig() {
    const configPath = path.join(__dirname, 'config.json');
    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        apiKey = config.API_KEY;
    } catch (error) {
        console.error('Failed to load config:', error);
    }
}

function createWindow() {
    const win = new BrowserWindow({
        width: 600,
        height: 800,
        icon: path.join(__dirname, 'lynndev.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'src/preload.js')
        }
    });

    win.loadFile('src/index.html');
    win.webContents.on('did-finish-load', () => {
        win.webContents.send('api-key', apiKey);
    });

    win.setMenu(null);
}

app.whenReady().then(() => {
    loadConfig();
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
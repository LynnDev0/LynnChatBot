const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'electronAPI', {
        receiveApiKey: (callback) => ipcRenderer.on('api-key', (event, apiKey) => {
            callback(apiKey);
        })
    }
);
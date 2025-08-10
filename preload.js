import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Dialog methods
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // Menu event listeners
  onMenuNewFile: (callback) => ipcRenderer.on('menu-new-file', callback),
  onMenuOpenFile: (callback) => ipcRenderer.on('menu-open-file', callback),
  onMenuSaveFile: (callback) => ipcRenderer.on('menu-save-file', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Platform info
  platform: process.platform,
  
  // Window controls (for custom title bar if needed)
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),
  
  // Custom events for your app
  sendToMain: (channel, data) => {
    // Whitelist of allowed channels
    const validChannels = [
      'sync-data',
      'update-settings',
      'export-data',
      'import-data'
    ];
    
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  onFromMain: (channel, func) => {
    const validChannels = [
      'sync-complete',
      'sync-error',
      'settings-updated',
      'export-complete'
    ];
    
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});

// Remove the loading text and show the app when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
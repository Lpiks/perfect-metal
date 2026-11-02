import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getInfo: () => ipcRenderer.invoke('app:getInfo'),
  printDocument: () => ipcRenderer.invoke('app:print'),
  saveBackup: (data: string) => ipcRenderer.invoke('app:saveBackup', data),
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  isWindowMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  onMaximizedChange: (callback: (isMax: boolean) => void) => {
    const handler = (_event: any, isMax: boolean) => callback(isMax)
    ipcRenderer.on('window:maximizedChange', handler)
    return () => {
      ipcRenderer.removeListener('window:maximizedChange', handler)
    }
  },
})

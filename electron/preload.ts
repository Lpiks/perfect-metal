import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getInfo: () => ipcRenderer.invoke('app:getInfo'),
  printDocument: () => ipcRenderer.invoke('app:print'),
  saveBackup: (data: string) => ipcRenderer.invoke('app:saveBackup', data),
})

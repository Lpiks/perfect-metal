import { app, BrowserWindow, ipcMain, shell } from 'electron'
import * as path from 'node:path'
import * as fs from 'node:fs'

let mainWindow: BrowserWindow | null = null
const isDev = !app.isPackaged

if (isDev) {
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'PERFECT METAL — ERP Rideaux Métalliques & Thermolaquage',
    autoHideMenuBar: true,
    fullscreenable: true,
    backgroundColor: '#07090E',
    icon: path.join(__dirname, '../public/logo.jpg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: true,
  })

  if (isDev) {
    mainWindow.loadURL('http://127.0.0.1:5174')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('[PERFECT METAL] Interface ERP chargée avec succès.')
    mainWindow?.show()
    mainWindow?.focus()
  })

  // Gestion des liens externes
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// IPC Handlers
ipcMain.handle('app:getInfo', () => ({
  appName: 'PERFECT METAL ERP',
  version: '1.0.0',
  userDataPath: app.getPath('userData'),
}))

ipcMain.handle('app:print', () => {
  mainWindow?.webContents.print({ silent: false, printBackground: true })
})

ipcMain.handle('app:saveBackup', (_event, jsonString: string) => {
  try {
    const backupDir = path.join(app.getPath('userData'), 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }
    const filename = `backup_${Date.now()}.json`
    const filePath = path.join(backupDir, filename)
    fs.writeFileSync(filePath, jsonString, 'utf-8')
    return { success: true, filePath }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

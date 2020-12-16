import { app, BrowserWindow, screen, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'
import * as url from 'url'
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer'

import { inicializeControllers } from './src'

let mainWindow: Electron.BrowserWindow | null

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
    width,
    height,
    resizable: false,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true,
    },
  })
  autoUpdater.setFeedURL({
    provider: 'github',
    repo: 'thebestacai-franchisee-app',
    owner: 'Amadelli-TheBestAcai',
    releaseType: 'release',
    private: false,
  })
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000')
  } else {
    // mainWindow.removeMenu()
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    )
  }

  mainWindow.setTitle('Gestor de Vendas')

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('page-title-updated', function (e) {
    e.preventDefault()
  })
}

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() })
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message =
    log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  console.log(log_message)
})

autoUpdater.on('update-available', () => {
  console.log('is available')
  mainWindow.webContents.send('update-available')
})

ipcMain.on('install_update', () => {
  autoUpdater.quitAndInstall()
})

ipcMain.on('check_for_update', function () {
  autoUpdater.checkForUpdates()
})

app
  .on('ready', createWindow)
  .whenReady()
  .then(() => {
    inicializeControllers()
    if (process.env.NODE_ENV === 'development') {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err))
      installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err))
    }
  })

app.allowRendererProcessReuse = true

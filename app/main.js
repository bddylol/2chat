// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const { Client } = require('discord-rpc')

const client = new Client({
  transport: 'ipc',
});

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    icon: __dirname + '/icon.ico'
  })

  // and load the index.html of the app.
  mainWindow.loadURL('https://2chat.bddy.repl.co')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    client.clearActivity();
    client.destroy();
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const RichPresence = {
  details: 'On the home page',
  state: 'Idling',
  largeImageKey: '2chat',
  largeImageText: '2chat'
}

ipcMain.handle('editRPC', async (_, pathname) => {
  RichPresence.details = {'voice': 'In a voice channel', 'channels': 'In a text channel'}[pathname.slice(1).split('/')[0]] || 'On the home page'

  RichPresence.state = {'channels': 'Chatting in #' + pathname.slice(1).split('/')[1], 'voice': 'Talking in ' + pathname.slice(1).split('/')[1]}[pathname.slice(1).split('/')[0]] || 'Idling'

  client.setActivity(RichPresence)
})

client.on('ready', async () => {
  client.setActivity(RichPresence)
});

client.login({ clientId: '1009207309525860383' });
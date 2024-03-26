const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { spawn, exec } = require('child_process');

var danmuWindow
var mainWindow
var musicWindow
var minecraftServerWindow
var novelWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'index/main-preload.js')
    }
  })
  mainWindow.loadFile('index/index.html')
  // 打开开发工具
  // mainWindow.webContents.openDevTools()
  mainWindow.on('close', () => {
    // 关闭其他窗口
    if (danmuWindow && !danmuWindow.isDestroyed()) {
      danmuWindow.close();
    }
    if (musicWindow && !musicWindow.isDestroyed()) {
      musicWindow.close();
    }
  });
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})

app.on('window-all-closed', () => {
  //如果操作系统不是苹果
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('clickConnect', (event, arg) => {
  if (danmuWindow && !danmuWindow.isDestroyed()) {
    return
  }
  danmuWindow = new BrowserWindow({
    width: 350,
    height: 475,
    alwaysOnTop: true,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'danmu/danmu.js')
    }
  })
  danmuWindow.webContents.send("roomId", arg);//
  // 打开开发工具
  danmuWindow.webContents.openDevTools()
  danmuWindow.setIgnoreMouseEvents(true)
  danmuWindow.setPosition(0, 300)
  danmuWindow.loadFile('danmu/danmu.html')
})

ipcMain.on('clickOpenMusic', (event, arg) => {
  if (musicWindow && !musicWindow.isDestroyed()) {
    return
  }
  musicWindow = new BrowserWindow({
    width: 350,
    height: 350,
    // alwaysOnTop: true,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'music/music.js')
    }
  })

  // 打开开发工具
  // musicWindow.webContents.openDevTools()
  // musicWindow.setIgnoreMouseEvents(true)
  musicWindow.setPosition(0, 0)
  musicWindow.loadFile('music/music.html')
})

ipcMain.on('clickminecraftServerStartButton', (event, arg) => {
  if (minecraftServerWindow && !minecraftServerWindow.isDestroyed()) {
    return
  }
  minecraftServerWindow = new BrowserWindow({
    // alwaysOnTop: true,
    transparent: true,
    frame: false,
    width: 350,
    height: 450,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'minecraftServer/minecraftServer.js')
    }
  })

  // 打开开发工具
  // minecraftServerWindow.webContents.openDevTools()
  // minecraftServerWindow.setPosition(1915, 0)
  minecraftServerWindow.loadFile('minecraftServer/minecraftServer.html')
})

ipcMain.on('packet', (event, arg) => {
  if (minecraftServerWindow && !minecraftServerWindow.isDestroyed()) {
    minecraftServerWindow.webContents.send("packet", arg);
  }
})

ipcMain.on('songName', (event, arg) => {
  if (musicWindow && !musicWindow.isDestroyed()) {
    musicWindow.webContents.send("songName", arg);
  }
})
//novel
ipcMain.on('clickOpenNovelButton', (event) => {
  if (novelWindow && !novelWindow.isDestroyed()) {
    return
  }
  novelWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'novel/novel.js')
    }
  })
  // 打开开发工具
  novelWindow.webContents.openDevTools()
  novelWindow.loadFile('novel/novel.html')
});
//设置鼠标穿透
ipcMain.on('danmuSetIgnoreMouse', (event, arg) => {
  if (danmuWindow && !danmuWindow.isDestroyed()) {
    danmuWindow.setIgnoreMouseEvents(arg)
    danmuWindow.setAlwaysOnTop(arg)
  }
})

ipcMain.on('musicSetIgnoreMouse', (event, arg) => {
  if (musicWindow && !musicWindow.isDestroyed()) {
    musicWindow.setIgnoreMouseEvents(arg)
    musicWindow.setAlwaysOnTop(arg)
  }
})
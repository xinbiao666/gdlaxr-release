// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const postFile = require('./nodeScript/postFile')

// Hot update
// try {
//   require("electron-reloader")(module, {});
// } catch (_) {}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // and load the index.html of the app.
  mainWindow.loadFile("./index.html");
  mainWindow.setMenu(null);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const mainWindow = createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.on("open-file-dialog", (e) => {
    dialog
      .showOpenDialog({
        title: "请选择目标文件夹",
        properties: ["openDirectory"],
      })
      .then((fileRes) => {
        if (!fileRes.canceled) {
          e.sender.send("selected-directory", fileRes.filePaths);
        }
      });
  });

  ipcMain.on("error-alert", (e, msg) => {
    dialog.showMessageBox(mainWindow, {
      type: "error",
      message: msg,
      title: "错误"
    });
  });

  ipcMain.on('post-file', async (event, data) => {
    try{
      let { useProject, description, directory } = data
      if(useProject.includes('app')){
        await postFile.releaseApp(event, useProject, description, directory)
      }else if(useProject.includes('web')){
        await postFile.releaseWeb(event, useProject, description, directory)
      }
    }catch(err){
      dialog.showMessageBox(mainWindow, {
        type: "error",
        message: String(err),
        title: "错误"
      });
    }
  })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

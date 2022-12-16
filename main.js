// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const { contextIsolated } = require('process')

const dgram = require("dgram");
// const commandDelays = require("./commandDelays");
//goes from the backend(robot information) to the frontend (User Interface)
const app1 = require("express")();
const server = require("http").createServer(app1);
const io = require("socket.io")(server);

const Port = 8889;
const StatePort = 8890;
const Host = "192.168.10.1";

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  connect_to_drone()

  mainWindow.loadFile('src/index.html')
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


const connect_to_drone = () =>{
  console.log("Connecting to drone....")

  const drone = dgram.createSocket("udp4");
  drone.bind(Port);
  const droneState = dgram.createSocket("udp4");
  droneState.bind(StatePort);
  io.on("connect", socket => {
    setInterval(moveDrone, frequency);
    socket.on("command", command => {
      console.log("command sent from browser: ", command);
      drone.send(command, 0, command.length, Port, Host, handleError);
    });
    socket.emit("status", "CONNECTED");
  });
}
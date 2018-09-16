const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const express = require('express')
const remote = require('./remote-control')

const expressApp = express()

const port = process.env.NODE_PORT || 8888

expressApp.use(express.static(path.join(__dirname, '../client')))

const server = require('http').createServer(expressApp);
const io = require('socket.io')(server);

server.listen(port, _ => console.log(`Server listening on port ${port}`))

io.on('connection', handleConnection);

function handleConnection(socket) {
  socket.on('rtc-message', payload => socket.broadcast.emit('rtc-message', payload));
  socket.on('rtc-event', remote);
}

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
const { Server, SocketIO } = require('mock-socket');
const {assert, expect} = require('chai');
const path = require('path');

global.electron = require('electron');

global.assert = assert;
global.expect = expect;

global.indexFilePath = path.join(__dirname, '../src/server/index.js');
global.mainFilePath = path.join(__dirname, '../src/server/main.js');

global.io = SocketIO;

global.doneDelay = 2000;

global.testSocketEndpoint = 'http://localhost:3333';
global.testServer = new Server(testSocketEndpoint);

global.testServer.on('rtc-message', (socket, payload) => {
  socket.broadcast.emit('rtc-message', payload);
});

global.asyncFinish = (done, delay = doneDelay) => {
  setTimeout(() => {
    done();
  }, delay);
}

global.asyncPerform = (callback, done, delay) => {
  setTimeout(() => {
    callback();
    done();
  }, delay);
}

after(() => {
  testServer.close();
})

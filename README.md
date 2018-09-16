# Capper Remote Screen Share App

This is a small Electron app designed to allow remote control of a machine through WebRTC.  It's based on the Electron [Quick Start Guide](http://electron.atom.io/docs/tutorial/quick-start).

### Getting Started

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/kenblasko/capper.git
# Go into the repository
cd capper
# Install dependencies
npm install
# Start on the host machine
npm start
```

Due to usage of [RobotJS](https://github.com/octalmage/robotjs), the machine must be running Node on NODE_MODULE_VERSION 57 (Nodejs 8.x.x).

By default, the application will share the primary desktop screen ("Entire screen").  The app exposes a node server running on port `8888` via the host machine's IP.  Use another networked computer to access the host machine's URL via `<host-ip>:8888` in a browser window.  The host machine's desktop screen should be visible from the browser window and you can also control the machine.


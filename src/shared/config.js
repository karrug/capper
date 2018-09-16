const socketEndpoint = '/'

const pcConfig = {
  iceServers: [{
    url: 'stun:stun.l.google.com:19302'
  }]
}

export {
  socketEndpoint,
  pcConfig as default
}
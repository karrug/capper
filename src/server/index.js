require('dotenv').config()

const electron = require('electron')
const io = require('socket.io-client')

const { removeAllPeers, removePeer, findPeer } = require('./peer-utils')
const { getSourceId } = require('./capture-utils')
const { log } = require('../shared/utils')

const { width, height } = electron.screen.getPrimaryDisplay().size

const endpoint = process.env.SOCKET_ENDPOINT
const socket = io.connect(endpoint)
const config = { iceServers: [{ url: process.env.GOOG_STUN_SERVER }] }

let peers = []
let localAudioStream = null;
let localScreenStream = null;

socket.on('rtc-message', handleMessage)

boot()

function boot() {
  getSourceId()
    .then(streamId => {
      log('streamId:', streamId)
      return Promise.all([ captureScreen(streamId), captureAudio() ])
    })
    .then(([screenStream, audioStream]) => {
      log('screenStream: ', screenStream)
      log('audioStream: ', audioStream)
      localScreenStream = screenStream;
      localAudioStream = audioStream;
    })
    .catch(log)
}

function captureAudio() {
  return capturePromise({
    audio: true,
    video: false
  })
}

function captureScreen(streamId) {
  return capturePromise({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: streamId,
        minWidth: width,
        minHeight: height,
        maxWidth: width,
        maxHeight: height
      }
    }
  })
}

function capturePromise(constraints) {
  return new Promise((resolve, reject) => {
    return navigator.mediaDevices.getUserMedia(constraints).then(resolve).catch(reject)
  })
}

function handleMessage(message) {
  const { clientId } = message

  // This is the initial call the client makes
  if (message.type === 'join') {
    return initPeerConnections(clientId, localScreenStream, localAudioStream)
  }

  const peer = findPeer(peers, clientId)
  const type = message.peerType || 'video'
  const pc = peer[type]

  if (message.type === 'offer') {
    pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
    pc.createAnswer()
      .then(handleSessionDescription.bind(peer, clientId))
      .catch(error)
  }

  // On answer - set the updated sdp for this peer
  if (message.type === 'answer') {
    pc.setRemoteDescription(new RTCSessionDescription(message.answer))
  }

  if (message.type === 'candidate') {
    pc.addIceCandidate(new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate: message.candidate
    }))
  }

  if (message.type === 'leave') {
    peers = removePeer(peers, clientId)
  }

  if (message.type === 'disconnect-all') {
    peers = removeAllPeers(peers)
  }

}

function sendMessage(message) {
  socket.emit('rtc-message', message)
}

function initPeerConnections(clientId, screenStream, audioStream) {

  const peer = createPeerConnections(clientId)

  peer.video.addStream(screenStream)
  peer.video.createOffer()
    .then(handleSessionDescription.bind(peer, 'video'))
    .catch(log)

  if (audioStream) {
    peer.audio.addStream(audioStream)
    peer.audio.createOffer()
      .then(handleSessionDescription.bind(peer, 'audio'))
      .catch(log)
  }

  peers.push(peer)
  log('Peer added, peers: ', peers)
}

function handleIceCandidate(event) {
  if (event.candidate) {
    return sendMessage({
      clientId: this.clientId,
      type: 'candidate',
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      peerType: event.candidate.sdpMid,
      candidate: event.candidate.candidate
    })
  }
  log('handleIceCandidate - end of candidates.')
}

function handleSessionDescription(type, sdp) {
  this[type].setLocalDescription(sdp)
  const message = { peerType: type, sdp: sdp, clientId: this.clientId }
  sendMessage(message)
}

function createPeerConnections(clientId) {
  const peer = {
    clientId,
    audio: new RTCPeerConnection(config),
    video: new RTCPeerConnection(config)
  }
  peer.audio.onicecandidate = handleIceCandidate.bind(peer)
  peer.video.onicecandidate = handleIceCandidate.bind(peer)
  return peer
}
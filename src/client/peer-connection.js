// @flow
import { log } from '../shared/utils'
import pcConfig from '../shared/config'
import socket from './socket'
import peer from './peer'
import type { Message, Candidate } from './types'
const { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription } = window

const { clientId } = peer

const onMessage = (message: Message): void => {

  const { clientId, isStarted } = peer

  if (!isStarted) {
    startPeerConnections()
  }

  if (message.clientId !== clientId) {
    return log('Different client, ignoring message')
  }

  const { peerType } = message

  if (message && peerType && isStarted) {

    const pc = peer.connections[peerType]

    if (message.sdp && message.sdp.type === 'offer') {
      pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
        .then(() => {
          pc.createAnswer()
            .then(answer => {
              pc.setLocalDescription(answer);
              return Promise.resolve(answer)
            })
            .then(answer => {
              sendMessage({ type: 'answer', answer }, peerType)
            })
            .catch(log)
        })
        .catch(log)
    }

    if (message.type === 'candidate') {
      pc.addIceCandidate(new RTCIceCandidate({
        sdpMLineIndex: message.label,
        candidate: message.candidate
      }))
    }

  }
}

const handleStateChange = (event, type: string) => {
  if (type === 'audio') return;
  const pc = peer.connections[type]
  const { iceConnectionState } = pc
  log('iceConnectionState:', iceConnectionState)
}

const handleIceCandidate = ({ iceCandidate }: { iceCandidate: Object }, type: string): void => {
  if (iceCandidate) {
    const { sdpMLineIndex, sdpMid, candidate }: Candidate = iceCandidate
    return sendMessage({
      clientId,
      type: 'candidate',
      label: sdpMLineIndex,
      id: sdpMid,
      peerType: type,
      candidate: candidate
    })
  }
  log('Done sending candidates')
}

const handleRemoteStreamAdded = (event, type: string): void => {
  const { elements: { audio, video } } = peer 
  log(`Added ${type} stream`, event.stream)
  type === 'video' ? video.srcObject = event.stream : audio.srcObject = event.stream
}

const handleRemoteStreamRemoved = (event, type: string): void => {
  const { elements: { audio, video } } = peer 
  log(`Removed ${type} stream`, event.stream)
  type === 'video' ? video.srcObject = null : audio.srcObject = null
}

const handleDataChannel = ({ channel }): void => {
  channel.onmessage = handleDCMessage;
}

const handleDCMessage = ({ data }): void => {
  log('channel message:', data)
}

const startPeerConnections = (): void => {
  const types = Object.keys(peer.connections);
  types.forEach(type => {
    peer.connections[type] = new RTCPeerConnection(pcConfig)
    peer.connections[type].oniceconnectionstatechange = (event) => handleStateChange(event, type)
    peer.connections[type].onaddstream = (event) => handleRemoteStreamAdded(event, type)
    peer.connections[type].onicecandidate = (event) => handleIceCandidate(event, type)
    peer.connections[type].onremovestream = (event) => handleRemoteStreamRemoved(event, type)
    peer.connections[type].ondatachannel = (event) => handleDataChannel(event)
    log('Connections created')
  })
  peer.isStarted = true
}

const sendMessage = (message, peerType = 'video'): void => {
  const msg = { ...message, clientId, peerType }
  socket.emit('rtc-message', msg)
}

const connect = (): void => {
  if (!peer.isStarted) startPeerConnections()
  sendMessage({ type: 'join', clientId })
}

const disconnect = (): void => {
  sendMessage({ type: 'leave', clientId })
}

export {
  onMessage,
  connect,
  disconnect
}
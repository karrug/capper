// @flow
import { onMessage, connect } from './peer-connection'
import events from './events'
import socket from './socket'

socket.on('rtc-message', onMessage)
connect()
events()
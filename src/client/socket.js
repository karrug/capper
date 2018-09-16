// @flow
import io from 'socket.io-client'
import { socketEndpoint } from '../shared/config'

export default io.connect(socketEndpoint)

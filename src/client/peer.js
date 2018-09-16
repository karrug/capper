// @flow
import { uuid, qs } from '../shared/utils'
import type { Peer } from './types'

const peer: Peer  = {
  isStarted: false,
  clientId: uuid(),
  connections: {
    audio: null,
    video: null
  },
  elements: {
    audio: qs('#remote-audio'),
    video: qs('#remote-video')
  }
}

export default peer
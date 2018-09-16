// @flow
export type Peer = {
  isStarted: boolean,
  clientId: string,
  connections: {
    audio: any,
    video: any
  },
  elements: {
    audio: {
      srcObject ? : string | null
    } | any,
    video: {
      srcObject ? : string | null
    } | any
  }
}

export type Candidate = {
  sdpMLineIndex: string,
  sdpMid: string,
  candidate: string
}

export type Message = {
  clientId: string,
  type ? : string,
  peerType ? : any,
  sdp ? : Object,
  label ? : string,
  candidate ? : Object
}

export type KeyEvent = {
  keyCode?: string | number | null,
  meta?: boolean,
  shift?: boolean,
  alt?: boolean,
  control?: boolean
}

export type MouseEvent = {
  click?: boolean | null,
  clientX?: number,
  clientY?: number,
  canvasWidth?: number,
  canvasHeight?: number,
  which?: number
}

export type MouseMoveEvent = {
  pageX: number,
  pageY: number,
  target: {
    offsetLeft: number,
    offsetTop: number
  }
}
export type ScrollEvent = {
  deltaX?: number,
  deltaY?: number
}

export type EventData = KeyEvent & MouseEvent
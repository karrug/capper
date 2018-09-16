// @flow
import idx from 'idx'
import socket from './socket'
import { qs, log } from '../shared/utils'
import type { KeyEvent, MouseEvent, MouseMoveEvent, ScrollEvent, EventData } from './types'

const sendEvent = (type: string, data: EventData) => {
  socket.emit('rtc-event', { type, data })
}

const addEvents = (): void => {
  const canvas: HTMLCanvasElement | any = qs('#capture')
  const addEvent: Function | any = idx(canvas, _ => _.addEventListener)
  const { width, height }: { width: number, height: number } = canvas.getBoundingClientRect()

  const canvasProps: {
    canvasWidth: number,
    canvasHeight: number
  } = {
    canvasWidth: width,
    canvasHeight: height,
  }

  addEvent('mousemove', ({ pageX, pageY, target: { offsetLeft, offsetTop } }: MouseMoveEvent) => 
    sendEvent('mousemove', {
      ...canvasProps, 
      toggle: false, 
      x: pageX - offsetLeft,
      y: pageY - offsetTop
    })
  )
  addEvent('mousedown', ({ pageX, pageY, target: { offsetLeft, offsetTop } }: MouseMoveEvent) => 
    sendEvent('mousedown', { 
      ...canvasProps,
      toggle: 'down',
      x: pageX - offsetLeft,
      y: pageY - offsetTop
    })
  )
  addEvent('mouseup', ({ pageX, pageY, target: { offsetLeft, offsetTop } }: MouseMoveEvent) => 
    sendEvent('mouseup', { 
      ...canvasProps,
      toggle: 'up',
      x: pageX - offsetLeft,
      y: pageY - offsetTop
    })
  )
  addEvent('keydown', ({ keyCode, shiftKey, metaKey, altKey, ctrlKey }: KeyboardEvent) =>
    sendEvent('keydown', { keyCode, shiftKey, metaKey, altKey, ctrlKey })
  )
  addEvent('wheel', ({ deltaX, deltaY }: ScrollEvent) => 
    sendEvent('wheel', { deltaX, deltaY })
  )
  addEvent('click', ({ which }: MouseEvent) => 
    sendEvent('click', { which, double: false })
  ) 
  addEvent('dblclick', () => 
    sendEvent('click', { double: true })
  )
}

export default (): void => addEvents()
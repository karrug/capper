const robot = require('robotjs')
const vkey = require('vkey')
const { log } = require('../shared/utils')
const { width, height } = robot.getScreenSize()

let isMouseButtonDown = false

const handleMouseMove = ({ canvasWidth, canvasHeight, x, y, toggle }) => {
  log(`handleMouseMove: canvasWidth: ${canvasWidth}, canvasHeight: ${canvasHeight}`)
  log(`handleMouseMove: x: ${x}, y: ${y}`)
  log(`handleMouseMove: toggle: ${toggle}`)
  let newX = (width / canvasWidth) * x
  let newY = (height / canvasHeight) * y

  if (toggle === 'down') {
    isMouseButtonDown = true
    robot.mouseToggle('down')
  }

  if (isMouseButtonDown) {
    return robot.dragMouse(newX, newY)
  }

  robot.moveMouse(newX, newY)
}

const handleScroll = ({ deltaX, deltaY }) => {
  log(`handleScroll: deltaX: ${deltaX}, deltaY: ${deltaY}`)
  robot.scrollMouse(deltaX, deltaY)
}

const handleMouseClick = ({ which, double }) => {
  log(`handleMouseClick: which: ${which}, double: ${double}`)
  let type = 'left'
  if (which === 2) type = 'middle'
  if (which === 3) type = 'right'
  if (isMouseButtonDown) {
    isMouseButtonDown = false
    robot.mouseToggle('up')
  }
  robot.mouseClick(type, double)
}

const handleKeyPress = ({ keyCode, shiftKey, metaKey, altKey, ctrlKey }) => {
  log(`handleKeyPress: keyCode: ${keyCode}`)
  log(`handleKeyPress: shiftKey: ${shiftKey}, metaKey: ${metaKey}, altKey: ${altKey}, ctrlKey: ${ctrlKey}`)
  let k = vkey[keyCode].toLowerCase()
  if (k === '<space>') k = ' '
  let modifiers = []
  if (shiftKey) modifiers.push('shift')
  if (ctrlKey) modifiers.push('control')
  if (altKey) modifiers.push('alt')
  if (metaKey) modifiers.push('command')
  if (k[0] !== '<') {
    if (modifiers[0]) robot.keyTap(k, modifiers[0])
    else robot.keyTap(k)
  } else {
    if (k === '<enter>') robot.keyTap('enter')
    else if (k === '<backspace>') robot.keyTap('backspace')
    else if (k === '<up>') robot.keyTap('up')
    else if (k === '<down>') robot.keyTap('down')
    else if (k === '<left>') robot.keyTap('left')
    else if (k === '<right>') robot.keyTap('right')
    else if (k === '<delete>') robot.keyTap('delete')
    else if (k === '<home>') robot.keyTap('home')
    else if (k === '<end>') robot.keyTap('end')
    else if (k === '<page-up>') robot.keyTap('pageup')
    else if (k === '<page-down>') robot.keyTap('pagedown')
  }
}

module.exports = ({ type, data }) => {
  log(`type: ${type}`)
  log(`data:`, data)
  switch (type) {
    case 'mouseup':
    case 'mousedown':
    case 'mousemove':
      handleMouseMove(data)
      break
    case 'click':
      handleMouseClick(data)
      break
    case 'keydown':
      handleKeyPress(data)
      break
    case 'wheel':
      handleScroll(data)
      break
    default:
      break
  }
}
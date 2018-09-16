const { desktopCapturer } = require('electron')

function filterSource(sources) {
  const possibleScreens = ['Screen 1', 'Entire screen']
  return sources.find(source => possibleScreens.includes(source.name))
}

function getSources() {
  return new Promise((resolve, reject) => {
    const options = {
      types: ['screen']
    }
    const handleResult = (error, sources) => error ? reject(error) : resolve(sources)
    desktopCapturer.getSources(options, handleResult)
  })
}

function getSourceId(func) {
  return new Promise((resolve, reject) => {
    getSources()
      .then(sources => {
        let source = filterSource(sources)
        resolve(source.id)
      })
      .catch(reject)
  })
}

module.exports = {
  getSourceId
}
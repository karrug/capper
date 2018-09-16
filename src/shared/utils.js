const uuid = () => {
  let d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const log = (statement = '', variable = '') => {
  console.log(statement, variable)
}

const qs = (selector = '') => document.querySelector(selector)

const scale = (x, fromLow, fromHigh, toLow, toHigh) => 
  (x - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow

module.exports = {
  uuid,
  log,
  qs,
  scale
}
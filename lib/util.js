var Vector = require('./vector')
function vertex(a, b) {
  return -b / (2 * a)
}

function height(a, b, c) {
  return parabola(a, b, c, vertex(a, b))
}

function parabola(a, b, c, x) {
  return a * x * x + b * x + c
}

function eventVector(evt) {
  return Vector({
    x: evt.touches && evt.touches[0].pageX || evt.pageX,
    y: evt.touches && evt.touches[0].pageY || evt.pageY
  })
}

module.exports.height = height
module.exports.eventVector = eventVector
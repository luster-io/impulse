var physics = require('./api')
  , phys = physics(document.getElementById('thing'))
  , Vector = require('./vector')
  , Velocity = require('touch-velocity')
  , mousedown = false
  , veloX
  , veloY

function applyCss(els, rules) {
  var length = els.length

  for(rule in rules) {
    if(rules.hasOwnProperty(rule)) {
      for(var i = 0 ; i < length ; i++) {
        els[i].style[rule] = rules[rule]
      }
    }
  }
}

function cssFunc(currentPosition) {
  return {
    webkitTransform: "translate3d(" + currentPosition.x +  "px, " + currentPosition.y + "px, 0)"
  }
}

phys.css(cssFunc)

var body = {
  position: Vector(50, 50),
  velocity: Vector(3, 50)
}

document.body.addEventListener('mousedown', function(evt) {
  mousedown = true
  veloX = new Velocity()
  veloY = new Velocity()
})

document.body.addEventListener('mouseup', function(evt) {
  mousedown = false

  var vel = Vector(veloX.getVelocity() || 0, veloY.getVelocity() || 0)

  phys.spring(vel, { x: evt.x, y: evt.y }, { x: 500, y: 500 })
  //.then(phys.springTo({ x: 501, y: 501 }, {}))
})

document.body.addEventListener('mousemove', function(evt) {
  if(mousedown) {
    veloX.updatePosition(evt.x)
    veloY.updatePosition(evt.y)
    var rules = cssFunc({ x: evt.x, y: evt.y })
    applyCss([document.getElementById('thing')], rules)
  }
})

// .then(phys.bounceTo({ x: 250, y: 250 }, { acceleration: 1000 }))
// .then(phys.springTo({ x: 250, y: 250 }, {}))
var physics = require('./api')
  , phys = physics(document.getElementById('thing'))

phys.css(function(currentPosition) {
  return {
    webkitTransform: "translate3d(" + currentPosition.x +  "px, " + currentPosition.y + "px, 0)"
  }
})

phys.accelerate(.1, {x: 0, y: 0}, {x: 250, y: 250}, { acceleration: 0 })

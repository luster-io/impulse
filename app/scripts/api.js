var Vector = require('./vector')
var simulation = require('./simulation')

module.exports = Physics

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

function Physics(el) {
  if(!(this instanceof Physics))
    return new Physics(el)

  this.el = el
}

Physics.prototype.css = function(fn) {
  this.cssRulesFn = fn
  return this
}

Physics.prototype.accelerate = function(velocity, to, from, opts) {
  var positionVector = Vector(to)
    , directionVector = Vector(from).sub(positionVector).normalize()
    , velocityVector = directionVector.mult(velocity)
    , accelerationVector = directionVector.mult(opts.acceleration)
    , that = this

  var body = simulation.addBody({
    position: positionVector,
    velocity: velocityVector,
    acceleration: accelerationVector
  })

  body.on('position', function(position) {
    var rules = that.cssRulesFn(position, to, from)
    applyCss([that.el], rules)
  })
}

Physics.prototype.friction = function(velocity, to, from, opts) {
  var positionVector = Vector(to)
    , directionVector = Vector(from).sub(positionVector).normalize()
    , velocityVector = directionVector.mult(velocity)
    , accelerationVector = directionVector.mult(opts.acceleration)
    , that = this

  var body = simulation.addBody({
    position: positionVector,
    velocity: velocityVector,
    acceleration: accelerationVector
  })

  body.on('position', function(position) {
    var rules = that.cssRulesFn(position, to, from)
    applyCss([that.el], rules)
  })
}
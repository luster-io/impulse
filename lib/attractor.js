var defaults = require('lodash.defaults')
  , simulation = require('./simulation')
  , Body = require('./body')

var defaultOptions = {
  strength: 1000,
  order: 2,
  friction: .1,
  offset: { x: 0, y: 0 },
}

module.exports = Attractor
function Attractor(phys, attachment, opts) {
  this._phys = phys
  this._opts = defaults({}, opts || {}, defaultOptions)
  this._attachment = attachment
}

Attractor.prototype.position = function(x, y) {
  if(this._running)
    this._body.position = Vector(x, y)
  else
    this._position = Vector(x, y)
}

Attractor.prototype.velocity = function(x, y) {
  if(this._running)
    this._body.velocity = Vector(x, y)
  else
    this._velocity = Vector(x, y)
}

Attractor.prototype.start = function() {
  var attachment = this._attachment
    , opts = this._opts
    , phys = this._phys
    , velocity = (this._velocity) ? this._velocity : phys.velocity()
    , position = (this._position) ? this._position : phys.position()

  var one = false

  this._running = true

  var body = this._body = Body(velocity, position, {
    accelerate: function(state, t) {
      var attachmentPosition = Vector(attachment.position())
      var distanceVector = attachmentPosition.sub(state.position)
      var distance = distanceVector.norm()
      if(distance < 10)
        distance = .1
      var acceleration = opts.strength / Math.pow(distance, 0)
      var accelVec = distanceVector.normalize().selfMult(acceleration)
        .selfSub(state.velocity.mult(opts.friction))
      return accelVec
    },
    update: function(position, velocity) {
      phys.position(position)
      phys.velocity(velocity)
    }
  })
  simulation.addBody(body)
  return this
}
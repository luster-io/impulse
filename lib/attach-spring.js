var defaults = require('lodash.defaults')
  , simulation = require('./simulation')
  , Body = require('./body')

var defaultOptions = {
  tension: 100,
  damping: 10,
  seperation: 0,
  offset: { x: 0, y: 0 }
}

module.exports = AttachSpring
function AttachSpring(phys, attachment, opts) {
  this._phys = phys
  this._opts = defaults({}, opts || {}, defaultOptions)
  if(typeof attachment.position === 'function')
    this._attachment = attachment.position.bind(attachment)
  else
    this._attachment = attachment
}

AttachSpring.prototype.position = function(x, y) {
  if(arguments.length === 0) {
    if(this._running)
      return this._body.position
    else
      return this._position = Vector(x, y)
  }
  if(this._running)
    this._body.position = Vector(x, y)
  else
    this._position = Vector(x, y)
}

AttachSpring.prototype.velocity = function(x, y) {
  if(this._running)
    this._body.velocity = Vector(x, y)
  else
    this._velocity = Vector(x, y)
}

AttachSpring.prototype.cancel = function(x, y) {
  this._running = false
  simulation.removeBody(this._body)
}

AttachSpring.prototype.running = function(x, y) {
  return this._running
}

window.unit = 0
AttachSpring.prototype.start = function() {
  var attachment = this._attachment
    , opts = this._opts
    , phys = this._phys
    , velocity = (this._velocity) ? this._velocity : phys.velocity()
    , position = (this._position) ? this._position : phys.position()

  phys._startAnimation(this)

  this._running = true

  var body = this._body = Body(velocity, position, {
    accelerate: function(state, t) {
      var distVec = state.position.selfSub(attachment())
        , dist = distVec.norm()
        , distNorm = distVec.normalize()

      if(distNorm.x === 0 && distNorm.y === 0) {
        distNorm.x = distNorm.y = 1
        distNorm.normalize()
      }
      var accel = distNorm
        .selfMult(-opts.tension)
        .selfMult(dist - opts.seperation)
        .selfSub(state.velocity.selfMult(opts.damping))

      return accel
    },
    update: function(position, velocity) {
      if(opts.offset) {
        var pos = position.add(opts.offset)
        phys.position(pos)
      } else {
        phys.position(position)
      }
      phys.velocity(velocity)
    }
  })
  simulation.addBody(body)
  return this
}
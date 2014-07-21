var defaults = require('lodash.defaults')
  , simulation = require('./simulation')
  , Body = require('./body')

var defaultOptions = {
  tension: 100,
  damping: 10,
  seperation: 0,
  offset: { x: 0, y: 0 },
}

module.exports = AttachSpring
function AttachSpring(phys, attachment, opts) {
  this._phys = phys
  this._opts = defaults({}, opts || {}, defaultOptions)
  this._attachment = attachment
}

AttachSpring.prototype.position = function(x, y) {
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

AttachSpring.prototype.start = function() {
  var attachment = this._attachment
    , opts = this._opts
    , phys = this._phys
    , velocity = (this._velocity) ? this._velocity : phys.velocity()
    , position = (this._position) ? this._position : phys.position()

  var one = false

  this._running = true

  var body = this._body = Body(Vector(0, 0), Vector(0, 0), {
    accelerate: function(state, t) {
      var dist = state.position.sub(Vector(attachment.position()))
        , distNorm = dist.clone().normalize()

      if(distNorm.x === 0 && distNorm.y === 0) {
        distNorm = Vector(1, 1).normalize()
      }
      var accel = distNorm
        .mult(-opts.tension)
        .mult(dist.norm() - opts.seperation)
        .sub(state.velocity.mult(opts.damping))

      one = true
      return accel
    },
    update: function(position, velocity) {
      phys.position(position)
      phys.velocity(velocity)
    }
  })
  simulation.addBody(body)
  return this
}
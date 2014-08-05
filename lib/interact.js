var Velocity = require('touch-velocity')
var Vector = require('./vector')
var Promise = window.Promise || require('promise')

module.exports = Interact

function Interact(phys, opts) {
  this._phys = phys
  this._running = false
}

Interact.prototype.position = function(x, y) {
  var pos = Vector(x, y)

  this._phys.position(pos)

  this._veloX.updatePosition(pos.x)
  this._veloY.updatePosition(pos.y)

  this._phys.velocity(this._veloX.getVelocity(), this._veloY.getVelocity())
  return this
}

Interact.prototype.delta = function(x, y) {
  this.position(this._initialPosition.add(Vector(x, y)))
  return this
}

Interact.prototype.start = function(opts) {
  var that = this

  this._running = true
  this._phys._startAnimation(this)
  this._initialPosition = this._phys.position()
  this._veloX = new Velocity()
  this._veloY = new Velocity()

  return this._ended = new Promise(function(res, rej) {
    that._resolve = res
    that._reject = rej
  })
}

Interact.prototype.cancel = function() {
  this._running = false
  this._reject(new Error('Canceled the interaction'))
}

Interact.prototype.running = function() {
  return this._running
}

Interact.prototype.end = function() {
  this._phys.velocity(this._veloX.getVelocity(), this._veloY.getVelocity())
  this._resolve({ velocity: this._phys.velocity(), position: this._phys.position() })
  return this._ended
}
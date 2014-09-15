var defaults = require('lodash.defaults')
var Velocity = require('touch-velocity')
var Vector = require('./vector')
var Promise = require('promise')
var util = require('./util')
var Boundary = require('./boundary')

module.exports = Interact

var defaultOpts = {
  boundary: Boundary({}),
  damping: 0,
  direction: 'both'
}

function Interact(phys, opts) {
  this._phys = phys
  this._running = false
  this._opts = defaults({}, opts, defaultOpts)

  //Warn of deprecated option
  if(this._opts.boundry){
    console.warn("Warning: Misspelled option 'boundry' is being deprecated. Please use 'boundary' instead.");
    this._opts.boundary = this._opts.boundry;
    delete this._opts.boundry;
  }
}

Interact.prototype.position = function(x, y) {
  var direction = this._opts.direction
    , boundary = this._opts.boundary
    , pos = Vector(x, y)

  if(direction !== 'both' && direction !== 'horizontal') pos.x = 0
  if(direction !== 'both' && direction !== 'vertical') pos.y = 0

  this._veloX.updatePosition(pos.x)
  this._veloY.updatePosition(pos.y)

  this._phys.velocity(this._veloX.getVelocity(), this._veloY.getVelocity())

  pos = boundary.applyDamping(pos, this._opts.damping)

  this._phys.position(pos)

  return this
}

Interact.prototype.update = function(evt) {
  //for jquery and hammer.js
  evt = evt.originalEvent || evt
  var position = util.eventVector(evt).sub(this._startPosition)

  this.position(position)
  return this
}

Interact.prototype.start = function(evt) {
  var that = this
    , evtPosition = evt && util.eventVector(evt)
    , position = this._phys.position()

  this._running = true
  this._phys._startAnimation(this)
  this._startPosition = evt && evtPosition.sub(position)
  this._initialPosition = this._phys.position()

  this._veloX = new Velocity()
  this._veloY = new Velocity()

  this.position(position)

  return this._ended = new Promise(function(res, rej) {
    that._resolve = res
    that._reject = rej
  })
}

Interact.prototype.distance = function() {
  return this._initialPosition.sub(this._phys.position()).norm()
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

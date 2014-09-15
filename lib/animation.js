var defaults = require('lodash.defaults')
  , Promise = window.Promise || require('promise')
  , Boundary = require('./boundary')
  , Vector = require('./vector')
  , Emitter = require('component-emitter')

var proto = {
  to: function(x, y) {
    if(x instanceof Boundary)
      this._to = x
    else
      this._to = Vector(x, y)
    return this
  },

  velocity: function(x, y) {
    this._velocity = Vector(x, y)
    return this
  },

  from: function(x, y) {
    this._from = Vector(x, y)
    return this
  },

  _updateState: function(position, velocity) {
    this._phys.position(position)
    this._phys.velocity(velocity)
  },

  cancel: function() {
    this._onEnd()
    this._running = false
    this._reject()
  },

  running: function() {
    return this._running || false
  },

  start: function() {
    var that = this
      , from = (this._from) ? this._from : this._phys.position()
      , to = (this._to) ? this._to : this._phys.position()
      , velocity = (this._velocity) ? this._velocity : this._phys.velocity()
      , opts = defaults({}, this._opts || {}, this._defaultOpts)

    var update = {
      state: function(position, velocity) {
        that._updateState(position, velocity)
      },
      done: function(position, velocity) {
        that._updateState(position, velocity)
        that._onEnd()
        that._running = false
        that._resolve({ position: position, velocity: velocity })
      },
      cancel: function(position, velocity) {
        that._updateState(position, velocity)
        that._onEnd()
        that._running = false
        that._reject()
      }
    }
    this._phys._startAnimation(this)

    this._running = true
    if(to instanceof Boundary)
      to = to.nearestIntersect(from, velocity)
    this._onStart(velocity, from, to, opts, update)

    return that._ended
  }
}

function Animation(callbacks) {
  var animation = function(phys, opts) {
    var that = this
    this._opts = opts
    this._phys = phys
    this._onStart = callbacks.onStart
    this._onEnd = callbacks.onEnd
    this._defaultOpts = callbacks.defaultOptions

    this._ended = new Promise(function(resolve, reject) {
      that._resolve = resolve
      that._reject = reject
    })

    this.start = this.start.bind(this)
  }

  Emitter(animation.prototype)
  animation.prototype = proto

  return animation
}





module.exports = Animation

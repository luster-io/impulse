var simulation = require('./simulation')
var Renderer = require('./renderer')
var defaults = require('lodash.defaults')
var Velocity = require('touch-velocity')
var Spring = require('./spring')
var Spring = require('./vector')
var AttachSpring = require('./attach-spring')
var Decelerate = require('./decelerate')
var Accelerate = require('./accelerate')
var Boundry = require('./boundry')
var Promise = window.Promise || require('promise')

module.exports = Physics

function Physics(rendererOrEls) {
  if(!(this instanceof Physics)) {
    return new Physics(rendererOrEls)
  }
  //if the user passed in a function, use that to render
  if(typeof renderer === 'function') {
    this._render = rendererOrEls
  //otherwise, they passed in elements, so use the default css renderer
  } else {
    this._renderer = new Renderer(rendererOrEls)
    this._render = this._renderer.update.bind(this._renderer)
  }

  this._position = Vector(0, 0)
  this._velocity = Vector(0, 0)
}

Physics.Boundry = Boundry

Physics.prototype.style = function() {
  this._renderer.style.apply(this._renderer, arguments)
  return this
}

Physics.prototype.interact = function() {
  var that = this
  var veloX
  var veloY
  var initialPosition
  var reject
  var resolve
  var running = false

  var ended = new Promise(function(res, rej) {
    resolve = res
    reject = rej
  })

  var interact = {
    delta: function(x, y) {
      if(!running) return
      x = initialPosition.x + x
      y = initialPosition.y + y

      that.position(x, y)
      veloX.updatePosition(x)
      veloY.updatePosition(y)
    },
    start: function() {
      running = true
      that._startAnimation(interact)
      initialPosition = that.position()
      veloX = new Velocity()
      veloY = new Velocity()

      return ended
    },
    cancel: function() {
      running = false
      reject(new Error('Canceled the interaction'))
    },
    running: function() {
      return running
    },
    end: function() {
      that.velocity(veloX.getVelocity(), veloY.getVelocity())
      resolve({ velocity: that.velocity(), position: that.position() })
      return Promise.resolve()
    }
  }
  return interact
}

Physics.prototype._startAnimation = function(animation) {
  if(this._currentAnimation && this._currentAnimation.running()) {
    this._currentAnimation.cancel()
  }
  this._currentAnimation = animation
}

Physics.prototype.velocity = function(x, y) {
  if(!arguments.length) return this._velocity
  this._velocity = Vector(x, y)
  return this
}

Physics.prototype.position = function(x, y) {
  if(!arguments.length) return this._position.clone()
  this._position = Vector(x, y)
  this._render(this._position)
  return this
}

var defaultSpringOptions = {
  damping: 10,
  tension: 100
}

Physics.prototype.spring = function(opts) {
  return new Spring(this, opts)
}

Physics.prototype.decelerate = function(opts) {
  return new Decelerate(this, opts)
}

Physics.prototype.accelerate = function(opts) {
  return new Accelerate(this, opts)
}

Physics.prototype.attachSpring = function(attachment, opts) {
  return new AttachSpring(this, attachment, opts)
}
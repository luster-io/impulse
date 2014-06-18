var Vector = require('./vector')
var simulation = require('./simulation')
var Promise = require('es6-promise').Promise
var Body = require('./body')
var style = require('./style')
var Velocity = require('touch-velocity')

module.exports = Physics

function Physics(els) {
  if(!(this instanceof Physics))
    return new Physics(els)

  that = this
  this.styles = {}

  this.veloX = new Velocity()
  this.veloY = new Velocity()

  if(typeof els === 'undefined')
    this.els = []
  else if(typeof els.length === 'undefined') //check if it's array-like
    this.els = [els]
  else
    this.els = [].slice.call(els)

  function loop() {
    requestAnimationFrame(function() {
      loop()
      if(that.currentPosition)
        that.updateStyles()
    })
  }
  loop()
}

Physics.prototype.style = function(property, value) {
  if(typeof property === 'object') {
    for(prop in property) {
      if(property.hasOwnProperty(prop)) {
        this.style(prop, property[prop])
      }
    }
  }
  this.styles[property] = value
  return this
}

Physics.prototype.position = function(fn) {
  this.positionFn = fn
  return this
}

Physics.prototype.decelerateTo = function(to, opts) {
  var that = this
  return function(state) {
    return that.decelerate(state.velocity, state.position, to, opts)
  }
}

Physics.prototype.accelerateTo = function(to, opts) {
  var that = this
  return function(state) {
    return that.accelerate(state.velocity, state.position, to, opts)
  }
}

Physics.prototype.springTo = function(to, opts) {
  var that = this
  return function(state) {
    return that.spring(state.velocity, state.position, to, opts)
  }
}

Physics.prototype.bounceTo = function(to, opts) {
  var that = this
  return function(state) {
    return that.bounce(state.velocity, state.position, to, opts)
  }
}

Physics.prototype.setPosition = function(position) {
  if(!this.running) {
    this.veloX.updatePosition(position.x)
    this.veloY.updatePosition(position.y)
  }
  this.currentPosition = Vector(position.x, position.y)
  if(this.positionFn)
    this.positionFn.call(this, this.currentPosition)
}

Physics.prototype.updateStyles = function() {
  style(this.currentPosition, this.els, this.styles)
}

Physics.prototype.getVelocity = function() {
  //if its running, get the current velocity from the simulation
  return Vector(this.veloX.getVelocity(), this.veloY.getVelocity())
}

Physics.prototype.accelerate = function(velocity, from, to, opts) {
  var that = this
    , resolve
    , body = new Body(velocity, from, to)

  this.running = true

  body.behavior(Body.behaviors.acceleration(opts.acceleration || 0))
  simulation.addBody(body)

  body.on('position', function(position) {
    if(!body.movedPastEnd()) {
      that.running = false
      position = body.to
      simulation.removeBody(body)
      resolve(body)
    }
    that.setPosition(position)
  })
  return new Promise(function(res, rej) {
    resolve = res
  })
}

Physics.prototype.decelerate = function(velocity, from, to, opts) {
  var that = this
    , resolve
    , body = this.body = new Body(velocity, from, to)

  this.running = true

  body.behavior(Body.behaviors.acceleration(-opts.acceleration || 0))
  simulation.addBody(body)

  body.on('position', function(position) {
    var movedPastEnd = true
    if(!(movedPastEnd = body.movedPastEnd()
    && body.velocity.directionEqual(body.direction))) {
      simulation.removeBody(body)
      that.running = false
    }
    //if it goes past the final position set it to the final position
    if(!body.movedPastEnd()) {
      position = body.to
      resolve(body)
    }
    that.setPosition(position)
  })
  return new Promise(function(res, rej) {
    resolve = res
  })
}

Physics.prototype.bounce = function(velocity, from, to, opts) {
  var that = this
    , resolve
    , body = this.body = new Body(velocity.negate().mult(opts.damping || .8), from, to)

  this.running = true

  body.behavior(Body.behaviors.acceleration(-opts.acceleration || -1000))
  simulation.addBody(body)

  body.on('position', function(position) {
    var currentDirection = position.sub(Vector(to))
    var isFinished = body.velocity.directionEqual(velocity) //it has reached the peak of its bounce
        && !currentDirection.directionEqual(body.direction)

    if(!isFinished) {
      that.setPosition(position)
    } else {
      that.running = false
      that.setPosition(to)
      simulation.removeBody(body)
      resolve(body)
    }
  })
  return new Promise(function(res, rej) {
    resolve = res
  })
}

Physics.prototype.cancel = function() {
  if(this.body)
    simulation.removeBody(this.body)
  this.running = false
  this.body = null
  this.veloX.reset()
  this.veloY.reset()
}

Physics.prototype.spring = function(velocity, from, to, opts) {
  var that = this
    , resolve
    , body = this.body = new Body(velocity, from, to)

  this.running = true

  opts = opts || {}
  body.behavior(Body.behaviors.spring(opts.b || 10, opts.k || 50))
  simulation.addBody(body)

  body.on('position', function(position) {
    that.setPosition(position)

    if(Math.abs(body.velocity.norm()) < .2) {
      that.running = false
      simulation.removeBody(body)
      resolve(body)
    }
  })

  return new Promise(function(res, rej) {
    resolve = res
  })
}

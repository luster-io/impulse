var Vector = require('./vector')
var simulation = require('./simulation')
var Promise = window.Promise || require('ayepromise')
var Body = require('./body')
var style = require('./style')
var Velocity = require('touch-velocity')

module.exports = Physics

function Physics(els) {
  if(!(this instanceof Physics))
    return new Physics(els)

  this.veloX = new Velocity()
  this.veloY = new Velocity()

  if(typeof els === 'undefined')
    this.els = []
  else if(typeof els.length === 'undefined') //check if it's array-like
    this.els = [el]
  else
    this.els = [].slice.call(els)
}

Physics.prototype.style = function(styles) {
  this.styles = styles
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
  this.position = Vector(position.x, position.y)
  this.positionFn.call(this, this.position)
  frame.once(this.updateStyles, this)
}

Physics.prototype.updateStyles = function() {
  style(this.position, this.els, this.styles)
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
  var positionVector = Vector(from)
    , directionVector = Vector(to).sub(positionVector).normalize()
    , velocityVector = (velocity instanceof Vector) ? velocity.negate() : directionVector.mult(velocity).negate()
    , accelerationVector = directionVector.mult(opts.acceleration).negate()
    , that = this
    , resolve

  this.running = true

  var body = simulation.addBody({
    position: positionVector,
    velocity: velocityVector.mult(opts.damping || .4),
    acceleration: accelerationVector
  })

  body.on('position', function(position) {
    var currentDirection = position.sub(Vector(to))
    var isFinished = !body.velocity.directionEqual(velocityVector) //it has reached the peak of its bounce
        && !currentDirection.directionEqual(directionVector)

    if(!isFinished) {
      that.setPosition(position)
    } else {
      that.running = false
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

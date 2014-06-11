var Emitter = require('tiny-emitter')
  , Vector = require('./vector')
  , inherits = require('inherits')

module.exports = Body

function Body(vel, from, to) {
  this.position = Vector(from)
  this.from = Vector(from)
  this.to = Vector(to)
  this.direction = this.to.sub(this.from).normalize()
  if(vel instanceof Vector)
    this.velocity = vel
  else
    this.velocity = this.direction.mult(vel)
  this.behaviors = []
}
inherits(Body, Emitter)

Body.prototype.accelerate = function(state, t) {
  var that = this
  var acceleration = Vector(0, 0)
  this.behaviors.forEach(function(behavior) {
    acceleration.selfAdd(behavior.call(that, state, t))
  })

  return acceleration
}
Body.prototype.movingTowardEnd = function() {
  var currentDirection = this.position.sub(this.to)
  return !currentDirection.directionEqual(this.direction)
}

Body.prototype.behavior = function(fn) {
  this.behaviors.push(fn)
}

var x = true

Body.behaviors = {
  spring: function(b, k) {
    return function(state, t) {
      return state.position.sub(this.to)
        .mult(-k)
        .sub(state.velocity.mult(b))
    }
  },
  acceleration: function(acceleration) {
    return function(state, t) {
      return this.direction.mult(acceleration)
    }
  }
}
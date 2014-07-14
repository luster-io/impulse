var Emitter = require('events')
  , Vector = require('./vector')
  , inherits = require('inherits')

module.exports = Body

function Body(vel, from, to) {
  this.position = Vector(from)
  this.from = Vector(from)
  this.to = Vector(to)

  if(vel instanceof Vector)
    this.velocity = vel
  else
    this.velocity = this.to.sub(this.from).normalize().mult(Math.abs(vel))

  this.direction = this.velocity.clone().normalize()
  this.behaviors = []
}
inherits(Body, Emitter)

Body.prototype.accelerate = function(state, t) {
  var that = this
    , acceleration = Vector(0, 0)
    , i
  for(var i = this.behaviors.length - 1; i >= 0; i--) {
    acceleration.selfAdd(this.behaviors[i].call(that, state, t))
  }
  return acceleration
}

Body.prototype.movedPastEnd = function() {
  var currentDirection = this.position.sub(this.to)
  return !currentDirection.directionEqual(this.direction)
}

Body.prototype.behavior = function(fn) {
  this.behaviors.push(fn)
}

Body.behaviors = {
  spring: function(b, k) {
    return function(state, t) {
      return state.position.selfSub(this.to)
        .selfMult(-k)
        .selfSub(state.velocity.mult(b))
    }
  },
  springAttach: function(attachment, seperation, b, k) {
    return function(state, t) {
      var dist = this.position.sub(attachment.position)
        , distNorm = dist.clone().normalize()
      if(distNorm.x === 0 && distNorm.y === 0) {
        distNorm = Vector(1, 1).normalize()
      }
      i++
      var accel = distNorm
        .mult(-k)
        .mult(dist.norm() - seperation)
        .sub(state.velocity.mult(b))
      return accel
    }
  },
  acceleration: function(acceleration) {
    return function(state, t) {
      return this.direction.mult(acceleration)
    }
  }
}
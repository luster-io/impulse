var Vector = require('./vector')
var simulation = require('./simulation')
var Promise = window.Promise || require('ayepromise')
var Body = require('./body')

module.exports = Physics

function applyCss(els, rules) {
  var length = els.length

  for(rule in rules) {
    if(rules.hasOwnProperty(rule)) {
      for(var i = 0 ; i < length ; i++) {
        els[i].style[rule] = rules[rule]
      }
    }
  }
}

function Physics(el) {
  if(!(this instanceof Physics))
    return new Physics(el)

  this.el = el
}

Physics.prototype.css = function(fn) {
  this.cssRulesFn = fn
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

Physics.prototype.accelerate = function(velocity, from, to, opts) {
  var that = this
    , resolve
    , body = new Body(velocity, from, to)

  body.behavior(Body.behaviors.acceleration(opts.acceleration || 0))
  simulation.addBody(body)

  body.on('position', function(position) {
    if(!body.movingTowardEnd()) {
      position = body.to
      simulation.removeBody(body)
      resolve(body)
    }
    var rules = that.cssRulesFn(position, to, from)
    applyCss([that.el], rules)
  })
  return new Promise(function(res, rej) {
    resolve = res
  })
}

Physics.prototype.decelerate = function(velocity, from, to, opts) {
  var that = this
    , resolve
    , body = new Body(velocity, from, to)

  body.behavior(Body.behaviors.acceleration(-opts.acceleration || 0))
  simulation.addBody(body)

  body.on('position', function(position) {
    if(!body.velocity.directionEqual(body.direction)) {
      simulation.removeBody(body)
      resolve(body)
    }
    //if it goes past the final position set it to the final position
    if(!body.movingTowardEnd()) {
      position = body.to
    }
    var rules = that.cssRulesFn(position, to, from)
    applyCss([that.el], rules)
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
      var rules = that.cssRulesFn(position, to, from)
      applyCss([that.el], rules)
    } else {
      simulation.removeBody(body)
      resolve(body)
    }
  })

  return new Promise(function(res, rej) {
    resolve = res
  })
}

Physics.prototype.spring = function(velocity, from, to, opts) {
  var that = this
    , resolve
    , body = new Body(velocity, from, to)

  body.behavior(Body.behaviors.spring(10, 50))
  simulation.addBody(body)

  body.on('position', function(position) {
    var rules = that.cssRulesFn(position, to, from)
    applyCss([that.el], rules)

    if(Math.abs(body.velocity.norm()) < .2) {
      simulation.removeBody(body)
      resolve(body)
    }
  })

  return new Promise(function(res, rej) {
    resolve = res
  })
}
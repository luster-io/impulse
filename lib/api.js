var simulation = require('./simulation')
var Promise = require('es6-promise').Promise
var Body = require('./body')

module.exports = Physics

function Physics(render) {
  this.render = render
}

Physics.prototype.accelerate = function(velocity, from, to, opts) {
  var that = this
    , resolve
    , body = this.body = new Body(velocity, from, to)

  this.running = true

  body.behavior(Body.behaviors.acceleration(opts.acceleration || 0))
  simulation.addBody(body)

  body.on('position', function(position) {
    if(!body.movedPastEnd()) {
      that.running = false
      position = body.to
      simulation.removeBody(body)
      that.render(position)
      resolve({ velocity: body.velocity, position: body.to })
    } else {
      that.render(position)
    }
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
      this.render(position)
      resolve(body)
    } else {
      this.render(position)
    }
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
    var currentDirection = position.sub(to)
    var isFinished = body.velocity.directionEqual(velocity) //it has reached the peak of its bounce
        && !currentDirection.directionEqual(body.direction)

    if(!isFinished) {
      that.render(position)
    } else {
      that.running = false
      simulation.removeBody(body)
      that.render(to)
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
    if(Math.abs(body.velocity.norm()) < 5 && position.sub(Vector(to.x, to.y)).norm() < .5) {
      that.running = false
      simulation.removeBody(body)
      that.render(to)
      resolve(body)
    } else {
      that.render(position)
    }
  })

  return new Promise(function(res, rej) {
    resolve = res
  })
}

Physics.prototype.infiniSpring = function(velocity, from, opts) {
  var that = this
    , resolve
    , body = this.body = new Body(velocity, from, from)

  opts = opts || {}
  body.behavior(Body.behaviors.spring(opts.b || 10, opts.k || 50))
  simulation.addBody(body)

  body.on('position', function(position) {
    that.render(position)
  })

  return {
    setDestination: function(to) {
      body.to = to
    }
  }
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

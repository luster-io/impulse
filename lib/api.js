var simulation = require('./simulation')
var Promise = require('es6-promise').Promise
var Body = require('./body')
var Vector = require('./vector')

module.exports = Physics

function Physics(render) {
  this.render = render
  this.position = Vector(0,0)
}

Physics.prototype.accelerate = function(velocity, from, to, opts) {
  var that = this
    , resolve
    , body = this.body = new Body(velocity, from, to)

  this.running = true

  body.behavior(Body.behaviors.acceleration(opts.acceleration || 0))
  simulation.addBody(body)

  body.on('position', function(position) {
    that.position = position
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
    that.position = position
    var movedPastEnd = true
    if(!(movedPastEnd = body.movedPastEnd()
    && body.velocity.directionEqual(body.direction))) {
      simulation.removeBody(body)
      that.running = false
    }
    //if it goes past the final position set it to the final position
    if(!body.movedPastEnd()) {
      position = body.to
      that.render(position)
      resolve(body)
    } else {
      that.render(position)
    }
  })
  return new Promise(function(res, rej) {
    resolve = res
  })
}

Physics.prototype.bounce = function(velocity, from, to, opts) {
  var that = thi
    , resolve
    , body = this.body = new Body(velocity.negate().mult(opts.damping || .8), from, to)

  this.running = true

  body.behavior(Body.behaviors.acceleration(-opts.acceleration || -1000))
  simulation.addBody(body)

  body.on('position', function(position) {
    that.position = position
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
    that.position = position
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

  this.position = Vector(from)

  opts = opts || {}
  body.behavior(Body.behaviors.spring(opts.b || 10, opts.k || 50))
  simulation.addBody(body)

  body.on('position', function(position) {
    that.position = position
    that.render(position)
  })

  return {
    setDestination: function(to) {
      body.to = to
    },
    setPosition: function(position) {
      body.position.x = position.x
      body.position.y = position.y
    }
  }
}

Physics.prototype.attachSpring = function(velocity, position, attachment, opts) {
  var that = this
    , body = this.body = new Body(velocity, position, position)

  opts = opts || {}
  body.behavior(
    Body.behaviors.springAttach(attachment, opts.seperation || 50, opts.b || 10, opts.k || 100)
  )
  simulation.addBody(body)

  body.on('position', function(position) {
    that.position = position
    that.render(position)
  })
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

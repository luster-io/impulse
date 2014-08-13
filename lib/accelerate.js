var Body = require('./body')
var simulation = require('./simulation')
var Boundry = require('./boundry')
var Animation = require('./animation')
var Vector = require('./vector')
var height = require('./util').height

var Accelerate = module.exports = Animation({
  defaultOptions: {
    acceleration: 1000,
    bounce: false,
    minBounceDistance: 5,
    damping: 0.2
  },

  onStart: function(velocity, from, to, opts, update, done) {
    var direction = to.sub(from).normalize()
    var acceleration = direction.mult(opts.acceleration)
    var bounceAcceleration = direction.mult(opts.bounceAcceleration || opts.acceleration)
    var bouncing
    var boundry = Boundry({
      left: (to.x > from.x) ? -Infinity : to.x,
      right: (to.x > from.x) ? to.x : Infinity,
      top: (to.y > from.y) ? -Infinity : to.y,
      bottom: (to.y > from.y) ? to.y : Infinity
    })

    var body = this._body = Body(velocity, from, {
      accelerate: function(s, t) {
        if(bouncing)
          return bounceAcceleration
        else
          return acceleration
      },
      update: function(position, velocity) {
        if(boundry.contains(position)) {
          update.state(position, velocity)
        } else {
          if(opts.bounce &&
             Math.abs(height(bounceAcceleration.norm(), velocity.norm() * opts.damping, 0)) > opts.minBounceDistance) {
              bouncing = true
              body.position = Vector(to)
              body.velocity.selfMult(-opts.damping)
              update.state(to, body.velocity)
          } else {
            update.done(to, velocity)
          }
        }
      }
    })
    simulation.addBody(this._body)
  },
  onEnd: function() {
    simulation.removeBody(this._body)
  }
})

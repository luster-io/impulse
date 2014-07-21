var Body = require('./body')
var simulation = require('./simulation')
var Boundry = require('./boundry')
var Animation = require('./animation')
var height = require('./util').height

var Accelerate = module.exports = Animation({
  defaultOptions: {
    acceleration: 1000,
    bounce: false,
    minBounceHeight: 30,
    damping: 0.3
  },
  onStart: function(velocity, from, to, opts, update, done) {
    var direction = to.sub(from).normalize()
    var acceleration = direction.mult(opts.acceleration)
    velocity = direction.mult(velocity.norm())
    var boundry = Boundry({
      left: Math.min(to.x, from.x),
      right: Math.max(to.x, from.x),
      top: Math.min(to.y, from.y),
      bottom: Math.max(to.y, from.y)
    })

    var body = this._body = Body(velocity, from, {
      accelerate: function(s, t) {
        return acceleration
      },
      update: function(position, velocity) {
        if(boundry.contains(position)) {
          update.state(position, velocity)
        } else {
          if(opts.bounce &&
             -height(acceleration.norm(), velocity.norm(), 0) > opts.minBounceHeight) {
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
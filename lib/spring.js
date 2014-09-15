var Body = require('./body')
var simulation = require('./simulation')
var Boundary = require('./boundary')
var Animation = require('./animation')

var Spring = module.exports = Animation({
  defaultOptions: {
    tension: 100,
    damping: 10
  },
  onStart: function(velocity, from, to, opts, update) {
    var body = this._body = new Body(velocity, from, {
      accelerate: function(state, t) {
        return state.position.selfSub(to)
          .selfMult(-opts.tension)
          .selfSub(state.velocity.mult(opts.damping))
      },
      update: function(position, velocity) {
        if(body.atRest() && body.atPosition(to)) {
          update.done(to, { x: 0, y: 0 })
        } else {
          update.state(position, velocity)
        }
      }
    })
    simulation.addBody(this._body)
  },
  onEnd: function() {
    simulation.removeBody(this._body)
  }
})

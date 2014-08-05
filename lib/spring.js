var Body = require('./body')
var simulation = require('./simulation')
var Boundry = require('./boundry')
var Vector = require('./vector')
var Animation = require('./animation')

var Spring = module.exports = Animation({
  defaultOptions: {
    tension: 100,
    damping: 10
  },
  onStart: function(velocity, from, to, opts, update) {
    var body = this._body = new Body(velocity, from, {
      accelerate: function(state, t) {
        return {
          x: ((state.position.x - to.x) * -opts.tension) - state.velocity.x * opts.damping,
          y: ((state.position.y - to.y) * -opts.tension) - state.velocity.y * opts.damping
        }
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

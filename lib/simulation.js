var Vector = require('./vector')
  , bodies = []
  , Body = require('./body')


function increment(a, b, c, d) {
  var vec = Vector(0, 0)
  vec.selfAdd(a)
  vec.selfAdd(b.add(c).selfMult(2))
  vec.selfAdd(d)
  vec.selfMult(1/6)
  return vec
}

function evaluate(initial, t, dt, d) {
  var state = {}

  state.position = d.dx.mult(dt).add(initial.position)
  state.velocity = d.dv.mult(dt).add(initial.velocity)

  return {
    dx: state.velocity,
    dv: initial.accelerate(state, t)
  }
}

var der = { dx: Vector(0, 0), dv: Vector(0, 0) }

function integrate(state, t, dt) {
    var a = evaluate( state, t, 0, der )
    var b = evaluate( state, t, dt*0.5, a )
    var c = evaluate( state, t, dt*0.5, b )
    var d = evaluate( state, t, dt, c )

    var dxdt = increment(a.dx,b.dx,c.dx,d.dx)
      , dvdt = increment(a.dv,b.dv,c.dv,d.dv)

    state.position.selfAdd(dxdt.selfMult(dt));
    state.velocity.selfAdd(dvdt.selfMult(dt));
}

var t
  , accumulator = 0

var dt = 16 / 1000

function simulate() {
  requestAnimationFrame(function(newTime) {
    newTime = newTime / 1000
    simulate()

    if(!t)
      return t = newTime

    var frameTime = newTime - t

    accumulator += frameTime

    var i = 0

    while(accumulator > 0) {
      i++
      var delta = Math.min(accumulator, dt)
      bodies.forEach(function(body) {
        integrate(body, t, delta)
      })
      accumulator -= delta
      t += delta
    }

    bodies.forEach(function(body) {
      body.emit('position', body.position)
    })
  })
}

simulate()

module.exports.addBody = function(body) {
  bodies.push(body)
  return body
}

module.exports.removeBody = function(body) {
  var index = bodies.indexOf(body)
  if(index >= 0)
    bodies.splice(index, 1)
}

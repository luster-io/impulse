var Vector = require('./vector')
  , bodies = []

function increment(a, b, c, d) {
  var vec = {
    x: (a.x + (b.x + c.x)*2 + d.x)/6,
    y: (a.y + (b.y + c.y)*2 + d.y)/6
  }
  return vec
}

var positionVec = Vector(0, 0)
var velocityVec = Vector(0, 0)

function evaluate(initial, t, dt, d) {
  var state = {}

  var state = {
    position: {
      x: d.dx.x * dt + initial.position.x,
      y: d.dx.y * dt + initial.position.y
    },
    velocity: {
      x: d.dv.x * dt + initial.velocity.x,
      y: d.dv.y * dt + initial.velocity.y
    }
  }

  // state.position = positionVec.setv(d.dx).selfMult(dt).selfAdd(initial.position)
  // state.velocity = velocityVec.setv(d.dv).selfMult(dt).selfAdd(initial.velocity)

  var next = {
    dx: state.velocity,
    dv: initial.accelerate(state, t)
  }
  return next
}

var der = { dx: Vector(0, 0), dv: Vector(0, 0) }
function integrate(state, t, dt) {
    var a = evaluate( state, t, 0, der )
    var b = evaluate( state, t, dt*0.5, a )
    var c = evaluate( state, t, dt*0.5, b )
    var d = evaluate( state, t, dt, c )

    var dxdt = increment(a.dx,b.dx,c.dx,d.dx)
      , dvdt = increment(a.dv,b.dv,c.dv,d.dv)

    state.position.x += dxdt.x * dt;
    state.position.y += dxdt.y * dt;

    state.velocity.x += dvdt.x * dt;
    state.velocity.y += dvdt.y * dt;
}

var t = Date.now() / 1000

function simulate() {
  setTimeout(function() {
    simulate()
    newTime = Date.now() / 1000

    var delta = newTime - t

    for(var i = 0, length = bodies.length ; i < length ; i++) {
      integrate(bodies[i], t, delta)
      bodies[i].update()
    }
    t = newTime
  }, 15)
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

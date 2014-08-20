var Vector = require('./vector')
  , bodies = []

function increment(a, b, c, d) {
  var vec = {
    x: (a.x + (b.x + c.x)*2 + d.x)/6,
    y: (a.y + (b.y + c.y)*2 + d.y)/6
  }
  return vec
}

function evaluate(initial, t, dt, d) {
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

var currentTime = Date.now() / 1000
  , accumulator = 0
  , t = 0
  , dt = 0.015

function simulate() {
  requestAnimationFrame(function() {
    simulate()
    var newTime = Date.now() / 1000
    var frameTime = newTime - currentTime
    currentTime = newTime

    if(frameTime > 0.05)
      frameTime = 0.05


    accumulator += frameTime

    var j = 0

    while(accumulator >= dt) {
      for(var i = 0 ; i < bodies.length ; i++) {
        bodies[i].previousPosition = bodies[i].position.clone()
        integrate(bodies[i], t, dt)
      }
      t += dt
      accumulator -= dt
    }

    for(var i = 0 ; i < bodies.length ; i++) {
      bodies[i].update(accumulator / dt)
    }
  }, 16)
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

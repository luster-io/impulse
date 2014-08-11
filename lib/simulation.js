var Vector = require('./vector')
  , bodies = []

function increment(a, b, c, d) {
  var vec = Vector(0, 0)
  vec.selfAdd(a)
  vec.selfAdd(b.add(c).selfMult(2))
  vec.selfAdd(d)
  vec.selfMult(1/6)
  return vec
}

var positionVec = Vector(0, 0)
var velocityVec = Vector(0, 0)

function evaluate(initial, t, dt, d) {
  var state = {}

  state.position = positionVec.setv(d.dx).selfMult(dt).selfAdd(initial.position)
  state.velocity = velocityVec.setv(d.dv).selfMult(dt).selfAdd(initial.velocity)

  var next = {
    dx: state.velocity.clone(),
    dv: initial.accelerate(state, t).clone()
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

    state.position.selfAdd(dxdt.selfMult(dt));
    state.velocity.selfAdd(dvdt.selfMult(dt));
}

var t = Date.now() / 1000

function simulate() {
  setInterval(function() {
    newTime = Date.now() / 1000

    var delta = newTime - t

    //TODO change this to an accumulator so
    //so we never get giant frames
    for(var i = 0 ; i < bodies.length ; i++) {
      integrate(bodies[i], t, delta)
      bodies[i].update()
    }
    t = newTime
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

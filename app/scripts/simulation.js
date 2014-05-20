var Vector = require('./vector')
  , bodies = []
  , Emitter = require('tiny-emitter')
  , inherits = require('inherits')

function Body(pos, vel, acc) {
  this.position = Vector(pos)
  this.velocity = Vector(vel)
  this.acceleration = Vector(acc)
}

inherits(Body, Emitter)

function accelerate(state, time) {
  var k = 100
  var b = 30
  //var spring = state.position.sub(700, windowHeight / 2).mult(-k).sub(state.velocity.mult(b))

  if(state.acceleration)
    return state.acceleration

  return Vector(0, 0)//(spring.x, spring.y)
}

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

  //dx * delta + initial
  state.position = d.dx.mult(dt).add(initial.position)
  state.velocity = d.dv.mult(dt).add(initial.velocity)

  return {
    dx: state.velocity,
    dv: initial.acceleration
  }
}



var der = { dx: Vector(0, 0), dv: Vector(0, 0) }

function integrate(state, t, dt) {
    //state.velocity.selfMult(.98)
    var a = evaluate( state, t, 0, der )
    var b = evaluate( state, t, dt*0.5, a )
    var c = evaluate( state, t, dt*0.5, b )
    var d = evaluate( state, t, dt, c )


    // if(state.position.y > windowHeight) {
    //   state.velocity.y = -Math.abs(state.velocity.y * .9)
    //   state.position.y = windowHeight
    // }

    // if(state.position.y < 0) {
    //   state.velocity.y = Math.abs(state.velocity.y * .9)
    //   state.position.y = 0
    // }

    // if(state.position.x < 0) {
    //    state.velocity.x = Math.abs(state.velocity.x * .9)
    //    state.position.x = 0
    // }

    // if(state.position.x > windowWidth) {
    //   state.velocity.x = -Math.abs(state.velocity.x * .9)
    //   state.position.x = windowWidth
    // }


    var dxdt = increment(a.dx,b.dx,c.dx,d.dx)
      , dvdt = increment(a.dv,b.dv,c.dv,d.dv)

    state.position.selfAdd(dxdt.selfMult(dt));
    state.velocity.selfAdd(dvdt.selfMult(dt));
}


var t
  , accumulator = 0

var dt = 4

function simulate() {
  requestAnimationFrame(function(newTime) {
    simulate()

    if(!t)
      return t = newTime

    var frameTime = newTime - t

    accumulator += frameTime

    while(accumulator >= dt) {
      bodies.forEach(function(body) {
        integrate(body, t, dt)
        body.emit('position', body.position)
      })
      accumulator -= dt
      t += dt
    }

  })
}

simulate()

module.exports.addBody = function(body) {
  var body = new Body(body.position, body.velocity, body.acceleration)
  bodies.push(body)
  return body
}
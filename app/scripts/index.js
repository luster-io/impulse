var Vector = require('./vector')
  , Velocity = require('touch-velocity')

var lastT

var body = {
  position: Vector(50, 50),
  velocity: Vector(3, 50)
}

var mousedown = false
  , veloX
  , veloY

document.body.addEventListener('mousedown', function(evt) {
  mousedown = true
  veloX = new Velocity()
  veloY = new Velocity()
  body.position.x = evt.x
  body.position.y = evt.y
})

document.body.addEventListener('mouseup', function(evt) {
  mousedown = false
  body.position.x = evt.x
  body.position.y = evt.y

  body.velocity.x = veloX.getVelocity() || 0
  body.velocity.y = veloY.getVelocity() || 0
})

document.body.addEventListener('mousemove', function(evt) {
  if(mousedown) {
    veloX.updatePosition(evt.x)
    veloY.updatePosition(evt.y)
    body.position.x = evt.x
    body.position.y = evt.y
  }
})

var item = document.querySelector('.thing')

function draw() {
  requestAnimationFrame(function(t) {
    draw()

    if(!lastT)
      return lastT = t

    if(!mousedown) {
      integrate(body, lastT/ 1000, (t - lastT) / 1000)
    }

    item.style.webkitTransform = "translate3d(" + body.position.x + "px, " + body.position.y + "px, 0)"

    lastT = t
  })
}

draw()

var windowWidth = window.document.documentElement.clientWidth
var windowHeight = window.document.documentElement.clientHeight - 10

function accelerate(state, time) {
  var k = 100
  var b = 30
  var spring = state.position.sub(700, windowHeight / 2).mult(-k).sub(state.velocity.mult(b))

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
    dv: accelerate(state, t + dt)
  }
}



var der = { dx: Vector(0, 0), dv: Vector(0, 0) }

function integrate(state, t, dt) {

    var a = evaluate( state, t, 0, der )
    var b = evaluate( state, t, dt*0.5, a )
    var c = evaluate( state, t, dt*0.5, b )
    var d = evaluate( state, t, dt, c )

    state.velocity.selfMult(.90)

    if(state.position.y > windowHeight) {
      state.velocity.y = -Math.abs(state.velocity.y * .9)
      state.position.y = windowHeight
    }

    if(state.position.y < 0) {
      state.velocity.y = Math.abs(state.velocity.y * .9)
      state.position.y = 0
    }

    if(state.position.x < 0) {
       state.velocity.x = Math.abs(state.velocity.x * .9)
       state.position.x = 0
    }

    if(state.position.x > windowWidth) {
      state.velocity.x = -Math.abs(state.velocity.x * .9)
      state.position.x = windowWidth
    }


    var dxdt = increment(a.dx,b.dx,c.dx,d.dx)
      , dvdt = increment(a.dv,b.dv,c.dv,d.dv)

    state.position.selfAdd(dxdt.selfMult(dt));
    state.velocity.selfAdd(dvdt.selfMult(dt));
}

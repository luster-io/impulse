//first, wrap your element(s) with a call to physics
var phys = physics(element)
var to = { x: 1000, y: 50 }

var accel = phys.accelerate(to, {
  acceleration: 1000,
  bounce: true,
  damping: 0.9,
  minBounceVelocity: 100
})

accel.then(phys.spring(to, { springConstant: 10, damping: 1 }))

accel(position, velocity)

accel.then(function(position, velocity) {

})

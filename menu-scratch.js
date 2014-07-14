var phys = new Physics($('.menu'))
  .style('translateY', function(pos) { return pos.y })

var lastY

$(window).on('touchstart', function(evt) {
  lastX = evt.touches[0].pageY
  phys.stop()
})

$(window).on('touchmove', function(evt) {
  var currentY = evt.touches[0].pageY
    , delta = currentY - lastY

  phys.position(0, phys.position() + delta)
  lastY = currentY
}

$(window).on('touchend', function(evt) {
  var velocity = phys.velocity()

  phys2.attachSpring(phys, { seperation, tension, damping })

  if(velocity.y < 0) {
    phys.spring(0, 0, opts)
  } else if(velocity.y > 0) {
    phys.accelerate(0, 0, opts)
      .then(phys.bounce.fn({ times: 1, acceleration: 2000 }))
  }
})

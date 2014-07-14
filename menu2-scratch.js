var renderer = new Physics.Renderer($('.menu'))
  .style('translateX', function(pos) { pos })

var phys = new Physics('1d', phys.renderer)
  , lastX

phys.position(0)

$(window).on('touchstart', function(evt) {
  lastX = evt.touches[0].pageY
  phys.interact()
})

$(window).on('touchmove', function(evt) {
  var currentY = evt.touches[0].pageY
    , delta = currentY - lastY

  phys.position(phys.position() + delta)
  lastY = currentY
})

$(window).on('touchend', function(evt) {
  var velocity = phys.velocity()

  if(velocity < 0) {
    phys.spring(opts).to(0).start()
  } else if(velocity > 0) {
    phys.accelerate({ acceleration: 1000 }).to(height)
    .start()
      .then(
        phys.bounce({ times: 1, acceleration: 2000, damping: .3 })
      )
  }
}) 
 

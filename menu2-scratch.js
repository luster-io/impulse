var phys = phys(els)
   .style({
     translateX: function(pos) { pos.x },
     translateY: function(pos) { pos.y }
   })

var interaction

var decelerate = phys.deccelerate(opts)
  .to(function(s) {
    return {
      x: 0,
      y: (s.velocity.y < 0) ? 0 : 500
    }
  }).start

var spring = phys.spring({ tension: 100, damping: 10 }).start


var interact
mc.on('panstart', function(evt) {
  interact = phys.interact()
  interact.start()
})

mc.on('pan', function(evt) {
  interact.delta(
    evt.deltaX,
    evt.deltaY
  )
})

mc.on('panend', function(evt) {
  interact.end()
    .then(decelerate)
    .then(spring)
})
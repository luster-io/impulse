var Physics = require('../../lib')
Hammer = require('hammerjs')
var mc = new Hammer.Manager($('.example1 .object')[0]);
mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );

var phys = new Physics($('.example1 .object'))
var opts = {}

phys.style('translateX', function(pos) { return pos.x + 'px' })
    .style('translatey', function(pos) { return pos.y + 'px'})

//set the initial position
phys.position(50, 50)

$('.example1 .animate').on('click', function() {
  opts = {
    tension: parseFloat($('.example1 .tension').val()),
    damping: parseFloat($('.example1 .damping').val()),
  }
  phys.position(50, 50)
    .spring(100, 50, 50, 400, 50, opts)
})

var startPosition

mc.on("panstart", function() {
  phys.stop()
  startPosition = phys.position()
})

mc.on('pan', function(evt) {
  phys.position(
    startPosition.x + evt.deltaX,
    startPosition.y + evt.deltaY
  )
})

mc.on('panend', function(evt) {
  phys.spring(400, 50, opts)
})

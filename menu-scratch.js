var Physics = require('../../lib')
  , Hammer = require('hammerjs')
  , mc = new Hammer.Manager($('.example1 .object')[0]);

mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );

var phys = new Physics($('.example1 .object'))
var startPosition

phys.style('translateX', function(pos) { return pos.x + 'px' })
    .style('translatey', function(pos) { return pos.y + 'px'})

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
  var veloY = phys.velocity().y
  if(veloY < 0) {
    phys.spring()
  } else if(velocityY > 0) {
    phys.accelerate({ bounce: true, damping: 0.3, minBounceDistance: 100 })
  }
})

phys
  .decelerate(options)
  .then(phys.spring(opts))

animate: {
  behavior: 'spring'
  endConditions: ['atRest', 'atDestination']
  start: { x, y }
  destination: { x, y }
  behaviorOptions: {
    tension: 123
    damping: 10
  }
}
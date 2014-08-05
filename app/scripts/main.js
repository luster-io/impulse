var Physics = require('../../lib')

var phys = new Physics($('.pull-down-menu'))
  .style('translateY', function(pos) { return pos.y + 'px' })

var interaction
  , startY
  , mousedown = false
  , isOpen = false
  , moved = false

function getY(evt) {
  return (evt.touches) ? evt.touches[0].pageY : evt.pageY
}

function start(evt) {
  mousedown = true
  moved = false
  interaction = phys.interact()
  interaction.start()
  startY = getY(evt) - phys.position().y
}

function move(evt) {
  if(!mousedown) return
  var position = getY(evt) - startY
    , height = window.innerHeight

  evt.preventDefault()
  moved = true

  //ensure the user can't pull the menu down below the bottom of the page
  interaction.position(0, Math.min(position, height))
}

function end(evt) {
  if(!mousedown) return
  var height = window.innerHeight
  interaction.end()
  mousedown = false

  //if the user touched one of the handles, but didn't move
  //that's a tap, so we toggle the menu
  if(!moved) {
    phys.velocity(0, 2000)
    isOpen = !isOpen
  } else {
    isOpen = phys.direction('down')
  }

  if(isOpen) {
    phys.accelerate({ acceleration: 1500, bounceAcceleration: 4000, bounce: moved })
      .to(0, height).start()
  } else {
    phys.spring({ tension: 100, damping: 15 })
      .to(0, 0).start()
  }
}

var elements = document.querySelectorAll('.nav-header, .close-handle')
elements = [].slice.call(elements)

elements.forEach(function(el) {
  el.addEventListener('touchstart', start)
  el.addEventListener('mousedown', start)

  el.addEventListener('touchmove', move)
  window.addEventListener('mousemove', move)

  el.addEventListener('touchend', end)
  window.addEventListener('mouseup', end)
})
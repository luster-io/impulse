$(function() {
  var Physics = require('../../lib')
  var menuHandle = document.querySelector('.nav-header')
  var closeHandle = document.querySelector('.close-handle')
  var menu = document.querySelector('.pull-down-menu')
  var height = window.innerHeight

  var phys = new Physics(menu)
  //only translateY, since the since the menu can't move horizontally
  phys.style('translateY', function(pos) { return pos.y + 'px' })

  var interaction
    , startY
    , mousedown = false

  function start(evt) {
    mousedown = true
    interaction = phys.interact()
    interaction.start()

    startY = evt.touches[0].pageY - phys.position().y
  }

  function move(evt) {
    evt.preventDefault()
    var position = evt.touches[0].pageY - startY

    //ensure the user can't pull the menu down below the bottom of the page
    position = Math.min(position, height)
    interaction.position(0, position)
  }

  function end(evt) {
    interaction.end()
    var position = phys.position().y

    // if the menu was moving up when the user released it,
    // or if they released it with no velocity, and they released in the
    // top half of the screen.
    if(phys.direction('up') || (phys.atRest() && position > height / 2)) {
      phys.spring({ tension: 100, damping: 15 })
        .to(0, 0).start()
    } else {
      phys.accelerate({ acceleration: 1500, bounceAcceleration: 4000, bounce: true })
        .to(0, height).start()
    }
  }

  menuHandle.addEventListener('touchstart', start)
  menuHandle.addEventListener('touchmove', move)
  menuHandle.addEventListener('touchend', end)

  closeHandle.addEventListener('touchstart', start)
  closeHandle.addEventListener('touchmove', move)
  closeHandle.addEventListener('touchend', end)

})
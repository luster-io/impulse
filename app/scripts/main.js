require('./pull-down')
// var Physics = require('../../lib')
//   , el = $('.object')[0]

// var phys = Physics(el)
//   .style({
//     translateX: function(pos) { return pos.x + 'px'},
//     translateY: function(pos) { return pos.y + 'px' }
//   })

// el.addEventListener('touchstart', start)
// el.addEventListener('touchmove', move)
// el.addEventListener('touchend', end)

// el.addEventListener('mousedown', start)
// window.addEventListener('mousemove', move)
// window.addEventListener('mouseup', end)

// var mousedown = false
//   , interaction

// function start(evt) {
//   evt.preventDefault()
//   mousedown = true
//   interaction = phys.interact()
//   interaction.start(evt)
// }

// function move(evt) {
//   if(!mousedown) return
//   evt.preventDefault()
//   interaction.update(evt)
// }

// function end() {
//   if(!mousedown) return
//   mousedown = false
//   interaction.end()

//   phys.spring({
//     tension: parseFloat($('.tension').val()),
//     damping: parseFloat($('.damping').val())
//   })
//     .to(0, 0).start()
// }
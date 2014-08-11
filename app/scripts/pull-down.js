var Physics = require('../../lib')

function PullDownMenu(menu, handles) {
  this.menu = new Physics(menu)
    .style('translateY', function(pos) { return pos.y + 'px' })

  handles = $(handles)
  handles.each(this.setupHandle.bind(this))

  this.isOpen = false
  this.moved = false
  this.boundry = new Physics.Boundry({ top: 0, bottom: window.innerHeight, left: 0, right: 0 })
}

PullDownMenu.prototype.setupHandle = function(i, el) {
  el = $(el)
  //start events
  el.on('touchstart', this.start.bind(this))
  el.on('mousedown', this.start.bind(this))

  //move events
  el.on('touchmove', this.move.bind(this))
  $(window).on('mousemove', this.move.bind(this))

  //end events
  el.on('touchend', this.end.bind(this))
  $(window).on('mouseup', this.end.bind(this))
}

PullDownMenu.prototype.start = function(evt) {
  this.mousedown = true
  this.moved = false
  this.interaction = this.menu.interact({
    boundry: this.boundry,
    damping: 0
  })
  this.interaction.start(evt)
}

PullDownMenu.prototype.move = function(evt) {
  if(!this.mousedown) return
  this.moved = true

  evt.preventDefault()
  this.interaction.update(evt)
}

PullDownMenu.prototype.end = function(evt) {
  if(!this.mousedown) return

  this.mousedown = false

  this.interaction.end()

  if(this.moved) {
    this.isOpen = this.menu.direction('down')
  } else {
    this.isOpen = !this.isOpen
  }

  if(this.isOpen) {
    this.menu.accelerate({ acceleration: 1500, bounceAcceleration: 4000, bounce: true })
      .to(0, this.boundry.bottom).start()
  } else {
    this.menu.spring({ tension: 100, damping: 15 })
      .to(0, this.boundry.top).start()
  }
}
var menu = new PullDownMenu($('.pull-down-menu'), $('.nav-header, .close-handle'))
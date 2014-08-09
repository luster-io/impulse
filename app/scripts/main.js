var Physics = require('../../lib')

function PullDownMenu(menu, handles) {
  this.phys = new Physics(menu)
    .style('translateY', function(pos) { return pos.y + 'px' })

  handles = [].slice.call(handles)
  handles.forEach(this.setupHandle, this)

  this.isOpen = false
  this.moved = false
  this.boundry = new Physics.Boundry({ top: 0, bottom: window.innerHeight })
}

PullDownMenu.prototype.setupHandle = function(el) {
  el.addEventListener('touchstart', this.start.bind(this))
  el.addEventListener('mousedown', this.start.bind(this))

  el.addEventListener('touchmove', this.move.bind(this))
  window.addEventListener('mousemove', this.move.bind(this))

  el.addEventListener('touchend', this.end.bind(this))
  window.addEventListener('mouseup', this.end.bind(this))
}

PullDownMenu.prototype.start = function(evt) {
  this.mousedown = true
  this.interaction = this.phys.interact({ boundry: this.boundry, damping: 0 })
  this.interaction.start(evt)
}

PullDownMenu.prototype.move = function(evt) {
  if(!this.mousedown) return
  evt.preventDefault()
  this.moved = true
  this.interaction.update(evt)
}

PullDownMenu.prototype.end = function(evt) {
  if(!this.mousedown) return
  this.interaction.end()
  this.mousedown = false

  //if the user touched one of the handles, but didn't move
  //that's a tap, so we toggle the menu
  this.isOpen = (!this.moved) ? !this.isOpen : this.phys.direction('down')

  if(this.isOpen) {
    this.phys.accelerate({ acceleration: 1500, bounceAcceleration: 4000, bounce: this.moved })
      .to(this.boundry).start()
  } else {
    this.phys.spring({ tension: 100, damping: 15 })
      .to(this.boundry).start()
  }
}
var menu = new PullDownMenu($('.pull-down-menu'), $('.nav-header, .close-handle'))
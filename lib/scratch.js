var mouseMove = function() {
  render.update(evt.x, evt.y)
}

var phys = physics(render.update.bind(render))

phys.spring(1000, { x: 50, y: 100 }, { x: 700, y: 200 })
var Vector = require('./vector')

module.exports = Body

function Body(vel, from, fns) {
  if(!(this instanceof Body)) return new Body(vel, from, fns)

  this.previousPosition = this.position = Vector(from)
  this.velocity = Vector(vel)
  this._fns = fns
}

Body.prototype.update = function() {
  this.previousPosition = this.position
  this._fns.update(this.position, this.velocity)
}

Body.prototype.accelerate = function(state, t) {
  return this._fns.accelerate(state, t)
}

Body.prototype.atRest = function() {
  return this.velocity.norm() < .01
}

Body.prototype.atPosition = function(pos) {
  //return whether the distance between this.position and pos is less than .1
  return this.position.sub(Vector(pos)).norm() < .01
}
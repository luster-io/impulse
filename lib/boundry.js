module.exports = Boundry

function Boundry(boundry) {
  if(!(this instanceof Boundry))
    return new Boundry(boundry)

  this.left = boundry.left
  this.right = boundry.right
  this.top = boundry.top
  this.bottom = boundry.bottom
}

Boundry.prototype.contains = function(pt) {
  return pt.x >= this.left &&
         pt.x <= this.right &&
         pt.y >= this.top &&
         pt.y <= this.bottom
}

function pointBetween(p, p1, p2) {
  return p >= p1 && p <= p2
}

function yIntersect(y, point, direction) {
  var factor = (y - point.y) / direction.y
  return point.add(direction.clone().mult(factor))
}

function xIntersect(x, point, direction) {
  var factor = (x - point.x) / direction.x
  return point.add(direction.clone().mult(factor))
}

Boundry.prototype.nearestIntersect = function(velocity, point) {
  var direction = Vector(velocity).normalize()
    , point = Vector(point)
    , isect
    , distX
    , distY

  if(velocity.y < 0)
    isect = yIntersect(this.top, point, direction)
  if(velocity.y > 0)
    isect = yIntersect(this.bottom, point, direction)

  if(isect && pointBetween(isect.x, this.left, this.right))
    return isect

  if(velocity.x < 0)
    isect = xIntersect(this.left, point, direction)
  if(velocity.x > 0)
    isect = xIntersect(this.right, point, direction)

  if(isect && pointBetween(isect.y, this.top, this.bottom))
    return isect

  //if the velocity is zero, or it didn't intersect any lines (outside the box)
  //just send it it the nearest boundry
  distX = (Math.abs(point.x - this.left) < Math.abs(point.x - this.right)) ? this.left : this.right
  distY = (Math.abs(point.y - this.top) < Math.abs(point.y - this.bottom)) ? this.top : this.bottom

  return (distX < distY) ? Vector(distX, point.y) : Vector(point.x, distY)
}
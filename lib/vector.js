module.exports = Vector

function Vector(x, y) {
  if(!(this instanceof Vector))
    return new Vector(x, y)

  if(typeof x.x !== 'undefined') {
    this.x = x.x
    this.y = x.y
  } else {
    this.x = x || 0
    this.y = y || 0
  }
}

Vector.prototype.equals = function(vec) {
  return vec.x === this.x && vec.y === this.y
}

Vector.prototype.directionEqual = function(vec) {
  return vec.x > 0 === this.x > 0 && this.y > 0 === vec.y > 0
}

Vector.prototype.dot = function (vec) {
  return this.x * vec.x + this.y * vec.y;
}

Vector.prototype.negate = function() {
  return Vector(this.x, this.y).mult(-1)
}

Vector.prototype.norm = function() {
  return Math.sqrt(this.normsq())
}

Vector.prototype.clone = function() {
  return Vector(this.x, this.y)
}

Vector.prototype.normsq = function() {
  return this.x * this.x + this.y * this.y
}

Vector.prototype.normalize = function() {
    var magnitude = this.norm()

    if(magnitude === 0) {
        return this
    }

    magnitude = 1 / magnitude

    this.x *= magnitude
    this.y *= magnitude

    return this
}

Vector.prototype.mult = function(x, y) {
  if(x instanceof Vector) {
    return new Vector(x.x * this.x, x.y * this.y)
  }
  if(typeof y === 'undefined') { //scalar
    return new Vector(x * this.x, x * this.y)
  }
  return new Vector(x * this.x, y * this.y)
}

Vector.prototype.selfMult = function(x, y) {
  if(x instanceof Vector) {
    this.x *= x.x
    this.y *= x.y
    return this
  }
  if(typeof y === 'undefined') { //scalar
    this.x *= x
    this.y *= x
    return this
  }
  this.x *= x
  this.y *= y
  return this
}

Vector.prototype.selfAdd = function(x, y) {
  if(typeof x.x !== 'undefined') {
    this.x += x.x
    this.y += x.y
    return this
  }
  if(typeof y === 'undefined') { //scalar
    this.x += x
    this.y += x
    return this
  }
  this.x += x
  this.y += y
  return this
}

Vector.prototype.selfSub = function(x, y) {
  if(typeof x.x !== 'undefined') {
    this.x -= x.x
    this.y -= x.y
    return this
  }
  if(typeof y === 'undefined') { //scalar
    this.x -= x
    this.y -= x
    return this
  }
  this.x -= x
  this.y -= y

  return this
}

Vector.prototype.sub = function(x, y) {

  if(typeof x.x !== 'undefined')
    return new Vector(this.x - x.x, this.y - x.y)

  if(typeof y === 'undefined')//scalar
    return new Vector(this.x - x, this.y - x)

  return new Vector(this.x - x, this.y - y)
}

Vector.prototype.add = function(x, y) {
  if(typeof x.x !== 'undefined') {
    return new Vector(this.x + x.x, this.y + x.y)
  }
  if(typeof y === 'undefined') { //scalar
    return new Vector(this.x + x, this.y + x)
  }
  return new Vector(this.x + x, this.y + y)
}

Vector.prototype.setv = function(vec) {
  this.x = vec.x
  this.y = vec.y
  return this
}

Vector.prototype.lerp = function(vector, alpha) {
  return this.mult(1-alpha).add(vector.mult(alpha))
}


function quadratic2(a, b, c) {
  if(a > 0)
    return (-b - Math.sqrt(b * b - 4 * a * c))/(2 * a)
  else
    return (-b + Math.sqrt(b * b - 4 * a * c))/(2 * a)
}

function decay(velocity, from, to, opts) {
  var distanceToEdge = to - from
    , sign = distanceToEdge / Math.abs(distanceToEdge)
    , gravity = sign * 1000

  velocity = Math.abs(velocity) * sign

  var c = -gravity / 2

  var timeToStop = velocity / gravity

  function positionFn(t) {
    return (c * (t*t) + velocity * t) + from
  }
  var timeToEdge = quadratic2(c, velocity, -distanceToEdge)
  if(isNaN(timeToEdge))
    timeToEdge = Infinity

  var time = Math.min(timeToEdge, timeToStop)
  var finalVelocity = -gravity * time + velocity

  return {
    duration: time,
    to: positionFn(time),
    finalVelocity: finalVelocity,
    fn: positionFn
  }
}


module.exports.decay = decay
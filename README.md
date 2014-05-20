#Physics
```
var phys = physics(element)
phys.style(function(currentPosition, fromPosition, toPosition) {
  return {
    webkitTransform: "translate3d(" + currentPosition.x +  "px, " + currentPosition.y + "px, 0)"
  }
})
```

```
var accel = phys.accelerate(velocity, from, to, {
  acceleration: 1000,
  minBounceVelocity: 100
})

accel.then(phys.bounceTo(velocity, from, to, { damping: .8, bounces: 1, minHeight: 10 }))

accel.then(phys.springTo(to, { springConstant: 10, damping: 1 })
```

Methods
=======
accelerate
decay
spring
bounce

accelerateTo
decelerateTo
springTo
bounceTo

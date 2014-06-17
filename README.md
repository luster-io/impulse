#Physics
```
var phys = physics(element)
phys.css(function(pos) {
  return {
    transform: "translate3d(" + pos.x +  "px, " + pos.y + "px, 0)"
  }
})
```

```
var accel = phys.accelerate(velocity, from, to, { acceleration: 1000 })
accel.then(phys.bounceTo(position, { damping: .8 }))
```

Methods
=======

##css

  The css method takes in a function, that should return an object of css style-value pairs.

##position

  A function that gets called with the position, in case you want to apply the css yourself.

###accelerate

accelerate's options are:
  * acceleration - pixels per second at which the body accelerates

decelerate
  * deceleration - pixels per second at which the body decelerates

spring
  * damping - damping on the spring
  * tension - the springs tension

bounce
  * damping - amount by which to dampen velocity before each bounce

## (.*)To methods

The (.*)To methods are the same as the methods without To, accept,
they don't take an initial velocity or position, instead they return
a function that takes a State object and starts the animation.

accelerateTo
decelerateTo
springTo
bounceTo

State
=====

##properties

###position
Vector { x: xPosition, y: yPosition }

###velocity
{ x: xVelocity, y: yVelocity }

#examples
  * Simulated Scroll
  * Scroll with snap
  * facebook's paper thing viewer
  * swipe left-right menu
  * rotational scroll
  * flip book pages
  * rotational scroll with snap
  * slide menu with bounce

#TODO

  * fix bounce.
  * make (.*)To methods take in velocity vector

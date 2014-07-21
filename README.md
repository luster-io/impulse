##Physics(els)

```
var phys = Physics($('.myMenu'))
var phys = Physics(document.getElementById)
```

  Initializes a new physics object with a single element or
an array like collection of elements.

##Physics(renderFn)

```
var phys = Physics(function(position) {
  //maybe pass the position to Facebook React, Ember, or d3 here.
})
```

  Initializes a new physics object with a render function.

## phys.style(property, valueFn(position, elementIndex))
## phys.style(cssObj)

```
phys.style('translateX', function(pos) { return pos.x + 'px' })
```

  Sets the css property in argument one to the value returned by the function
in argument two, for every element passed into the constructor, every time the
physics object's position changes. If you set a custom render function in the
constructor this method doesn't do anything, since you're manually rendering
yourself.

  The first argument to the `valueFn` is an object with positions {x, y}, the
second argument is the index of the element, since the function is called
once for each item in the collection of elements.

## phys.position()

  Gets the current position {x, y} of the physics object.

## phys.position(x, y)

  Set's the current position to {x, y}.  Changes made by this function
will be rerendered, and, if a physics animation is currently running, will
update the position of the object in the animation.



## phys.velocity()

  Get's the current velocity of the object, if an animation is running, this
will be the current velocity from the animation, if an animation isn't running, the
velocity will be the velocity of from the user interacting (manually setting
it's position).

  Get's the current velocity of the object, when interacting with the physics
object (manually setting it's position) this velocity is kept up to date by
calls to position.

## phys.velocity(scalar)

  This will set the velocity of the physics object to `scalar` units per second.
The velocity will be in the same direction as it was previously.

## phys.velocity(x, y)

  This will set the velocity of the physics object to `vector` units per second.
Setting velocity with an x and a y may change the direction the object is moving.

# Spring Animation

phys.spring(50, 100, { velocity:  })
Options:
  from: {x, y}, defaults to the currentPosition
  tension: the spring's tension (default: 100)
  damping: the springs damping (default: 10)
  velocity: {x, y} (default: finalVelocityofLastAnimation or 0)
```
//an example with tension and damping sliders
```

phys.spring

## phys.spring(x, y, opts)

  Springs from the object's current position, to x, y at the object's current
velocity.

# Accelerate

Options:
  bounce: (default: true)
  damping: amount to damp the velocity on each bounce
  minBounceVelocity: 100 (default: 100)
  acceleration: { x, y } how fast to accelerate in each of the y, x

```
Demo with all of the options as sliders, for testing.
```

##
# attract
## phys.attract(, opts)

options:
  strength: scalar strength of attraction (default: 1)
  friction: 1 means no friction, 0 is an immovable object (default: .999)

  order: The power of inverse distance.
  2 is inverse square (newtonian), 1 is linear, 0 is constant. (default: 2)

  Instead of accelerating linearly in x and y, accelerate towards a point.
This can simulate orbital dynamics.

## phys.accelerate
  Returns a promise that will resolve when the physics object reaches the point x, y.

## phys.accelerate(x, y, opts)

# deccelerate

## phys.deccelerate

  Returns a promise that will resolve when the physics object has moved past point x, y.
The promise will reject if the object deccelerates to a stop without reaching the point.
Unless stopAtEnd is false, in which case it will never resolve, only reject if phys.stop
is called.

## phys.deccelerate(x, y, opts)
  Deccelerate towards x, y starting from the current position, and at the current velocity.

## phys.attachOrbital(attach, startX, startY)
options:
  strength: scalar strength of attraction (default: 1)
  friction: 1 means no friction, 0 is an immovable object (default: .999)
  order: The power of inverse distance.
  2 is inverse square (newtonian), 1 is linear, 0 is constant. (default: 2)

  Set initial position.

## phys.attachGravity(attach, velocity, startX, startY)

  Set initial position and velocity.

# attachSpring

Options:
  tension: the spring's tension (default: 100)
  damping: the springs damping (default: 10)
  seperation: distance to maintain from attachment, if closer than `seperation` it will spring
  away, if further away it will spring towards it.
  offset: { x, y } offset from attachment's position

## phys.attachSpring(attachment, opts)

Attaches a spring to a physics object or function `attachment`. If `attachment`
is a function, it should return always return the current { x, y } positions
of the thing you are attaching to.

var spring = phys.attachSpring(attachment, opts)

## Methods

###spring.start()

  This starts the spring running.

###spring.position()

  Updates the position of the spring.  If the spring is running, this will
affect the simulation.

###spring.velocity(x, y)

  Updates the velocity of the spring in flight.  If the spring is running, this will
affect the simulation.


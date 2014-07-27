#Luster Physics

  Create animations that flow naturally from the user's movements.

  Rather than animating properties for a set amount of time,
luster physics takes a start position, end position, and velocity.

##example

```
var phys = Physics(el)
  .style({
    translateX: function(pos) { return pos.x }
    translateY: function(pos) { return pos.y }
  })
//set a starting position
phys.position(50, 50)

phys.spring({ tension: 100, damping: 10 })
  .to(100, 100).start()
```

More examples can be found [here](labs.luster.io/physics/examples)

##Installation

####Browserify
```
npm install luster-physics
```

####Bower

```
bower install luster-physics
```
Exposes a global called Physics

####Component

```
component install luster-io/luster-physics
```

####Manually

Download `build/luster-physics.js` or `build/luster-physics.js`

```html
  <script src="/scripts/luster-physics.js"></script>
```

Exposes a global called Physics

##Documentation

Documentation can be found [here](labs.luster.io/physics/examples)

###Physics(els)

```
var phys = Physics($('.myMenu'))
var phys = Physics(document.getElementById)
```

  Initializes a new physics object with a single element or
an array-like collection of elements (jQuery, NodeList, etc).

###Physics(renderFn)

```
var phys = Physics(function(position) {
  //maybe pass the position to Facebook React, Ember, or d3 here.
})
```

  Initializes a new physics object with a render function.  Whenever
there is a change in the state of the physics object, the render function
will be called.

  PROTIP: This may be called more often than you actually want to draw to
the page, so make sure your renderer will do debounce the updates.  

### phys.style(property, valueFn(position, elementIndex))

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

### phys.style(cssObj)

  Style can also be an object of the style `{ cssProperty: valueFn, anotherProp: anotherValFn }`. 

### phys.position()

  Gets the current position {x, y} of the physics object.

### phys.velocity()

  Get's the current velocity of the object, if an animation is running, this
will be the current velocity from the animation.

  Get's the current velocity of the object, when interacting with the physics
object (manually setting it's position) this velocity is kept up to date by
calls to position.

# Spring Animation

####Options:
  * **tension:** the spring's tension (default: 100)
  * **damping:** the springs damping (default: 10)
  
```
var animation = phys.spring({ tension: 100, damping: 10 })
```

### phys.spring(opts)

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

### phys.accelerate
  Returns a promise that will resolve when the physics object reaches the point x, y.

### phys.accelerate(x, y, opts)

## deccelerate

### phys.deccelerate

  Returns a promise that will resolve when the physics object has moved past point x, y.
The promise will reject if the object deccelerates to a stop without reaching the point.
Unless stopAtEnd is false, in which case it will never resolve, only reject if phys.stop
is called.

### phys.deccelerate(x, y, opts)
  Deccelerate towards x, y starting from the current position, and at the current velocity.
  
##Animation

###animation.to(x, y)
###animation.to({ x, y })

   This sets the position that the animation is moving towards.  This defaults to
the current position of the physics object.

###animation.from(x, y)
###animation.from({ x, y })

   This sets the position that the animation starts at.  This defaults to
the current position of the physics object.

###animation.velocity(scalar)
###animation.velocity(x, y)
###animation.velocity({x, y})

   This sets the initial velocity for the animation.  When only a scalar (Number) is passed in, it will default to moving in the direction from the start to the end position.  If not called, the velocity defaults to the current velocity of the physics object.
   
###animation.start()

   Starts the animation running.  This will cancel any other running animations.
This method is bound to `animation`, so you can conveniently pass it around without having to manually bind it.

## phys.attachSpring(attachment, opts)

  The `attachSpring` method works differently than other animation methods, in that it is constantly running, and responds to updates to the position of it's `attachment`.

Options:
  tension: the spring's tension (default: 100)
  damping: the springs damping (default: 10)
  seperation: distance to maintain from attachment, if closer than `seperation` it will spring
  away, if further away it will spring towards it.
  offset: { x, y } offset from attachment's position

  `attachment` can be another physics object, or it can be a function that will return a position { x, y } when called.

  Attaches a spring to a physics object or function `attachment`. If `attachment` is a function, it should return always return the current { x, y } positions
of the thing you are attaching to.

  Returns an `attachedSpring`, whose position and velocity can be updated as the animation is running.

```
var attachedSpring = phys.attachSpring(attachment, opts)
```

###attachedSpring.end()

  Stops the spring from running.

###attachedSpring.position()

  Updates the position of the spring.  If the spring is running, this will
affect the simulation.

###attachedSpring.velocity(x, y)

  Updates the velocity of the spring in flight.  If the spring is running, this will affect the simulation.
  
## phys.interact()

  If you want to allow a user to interact with a physics object, i.e. drag it around.  This will update the renderer with the position set by interact, and will record the final velocity.
  
###interaction.start()

  Starts the interaction, returns a promise that will fulfill when end is called
or reject when the interaction is cancelled.

###interaction.cancel()
 
  Stops the interaction and rejects the promise returned by start.
  
###interaction.position(x, y)
###interaction.position({ x, y })

  Updates the position of the physics object.  This position, along with the time it occured will be used to calculate the velocity of the physics object.
  
###interaction.end()

  Ends the interaction.  You can do this on touchend.  Returns a promise fulfilled with the final state of the interaction.  
  



##LICENSE
 MIT -- Read LICENCE
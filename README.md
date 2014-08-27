#Impulse

  Create animations that flow naturally from the user's movements.

  Rather than animating properties for a set amount of time,
impulse takes a start position, end position, and velocity.

##example

```
var ball = Impulse(document.querySelector('.ball'))
  .style({
    translate: function(x, y) { return x + 'px, ' + y + 'px' },
  })
//set a starting position
ball.position(50, 50)

ball.spring({ tension: 100, damping: 10 })
  .to(100, 100).start()
```

More examples can be found [here](impulse.luster.io/examples.html)

##Installation

####Browserify
```
npm install impulse
```

####Bower

```
bower install impulse
```
Exposes a global called Physics

####Component

```
component install luster-io/impulse
```

####Manually

Get `build/impulse.js` or `build/impulse.min.js` from github.

```html
  <script src="/scripts/impulse.js"></script>
```

Exposes a global called impulse

##High Level Explanation

  Calling impulse on an element or set of elements returns a PhysicsObject.
A physics object maintains it's own position and velocity.  You can interact
with a PhysicsObject (drag, pan, etc), and animate it.  Animations take
the current position and velocity of the PhysicsObject as a starting point, and
animate to a user defined position.

  This makes the animations flow naturally from the user's actions.

  For example a user can drag an element around.  Once they're done dragging,
the next animation will start from the position and velocity that they left off.
Making the animation feel like a natural extension of their movement.

Documentation can be found [here](labs.luster.io/physics/examples)

#Contributing

  Bug reports are extremely useful, if you think something's wrong, create an
issue.

  If there's an interaction you'd like to see, but you don't know if it's
possible, please create an issue.  Maybe we can find a way to build it!

#TODO
 
  Impulse should do NO WORK when in a quiescent state.  (not even spinning
                                                             requestAnimationFrame
                                                             no-ops)

  Rename `damping` to `restitution` for acclerate.

  Throw error if using renderer and no styles are defined?

  CSS animation generator.  Sometimes you want a spring or acceleration
animation, but you want it always starts with the same initial velocity and
position.  In this case it would be much smarter to generate a css keyframe
animation, and cache it.

  Performance instrumenting.  Use something like,
http://google.github.io/tracing-framework/, to get better insights into where
the performance bottlenecks are.  The goal would be to be able to simulate
100's of springs without any performance hit.

  Angular rotation.  Add a way to do angular rotation. (not the framework, like angles)

  More examples.  The more examples the better.  If you have an idea for an
example you'd like to see created, create an issue.

  Use analytical solution for acceleration and deceleration.  There's may be no need to run a physics simulation for acceleration and deceleration, since these are pretty easily computed analytically, which would be much faster than numeric integration.

  Accumulator timestep with alpha smoothing.  Instead of just using whatever time the browser throws at us we should have a fixed timestep, integrate over those steps, and then linearly interpolate between states with unused time at each render, i.e. set timestep to Yms, update every Xms, and interpolate any extra time.

##LICENSE
 MIT -- Read LICENCE

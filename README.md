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

More examples can be found [here](http://impulse.luster.io/examples.html)

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

  Calling `Impulse` on an element or set of elements returns an Impulse object.
A physics object maintains it's own position and velocity.  You can interact
with a Impulse object (drag, pan, etc), and animate it.  Animations take
the current position and velocity of the PhysicsObject as a starting point, and
animate to a user defined position.

  This makes the animations flow naturally from the user's actions.  For example a user can drag an element around.  Once they're done dragging,
the next animation will start from the position and velocity that they left off.

Documentation can be found [here](http://impulse.luster.io/guides.html)

#Contributing

  Bug reports are extremely useful, if you think something's wrong, create an
issue.

  If there's an interaction you'd like to see, but you don't know if it's
possible, please create an issue.  Maybe we can find a way to build it!

##LICENSE
 MIT -- Read LICENCE

  One of the easiest things to build with luster physics is a pull down menu.
We'll build a pulldown menu that accelerates as if it were being pulled down
by gravity and bounces when it hits the bottom. When it's closing it will
act as if it's being pulled up by a spring.

  Let's start by creating some markup for our menu.

```html
<body>
  <div class="nav-header">
    <div class="hamburger-menu-handle"></div>
  </div>
  <div class="pull-down-menu">
    <div class="close-handle">close</div>
  </div>
</div>
```

  We have the menu itself `.pull-down-menu`, and then we have a top nav bar
`.nav-header` with a hamburger menu icon `.hamburger-menu-handle` (three
bars), which when clicked or dragged, will open and close the menu.

  Add some basic css.  To keep this post reasonable I'm not going to explain
everything about the css.  The important thing is that it creates a menu that
is the full height and width of the viewport, and shifts it off screen, above
the viewport.

  We'll start off by creating a physics object for the menu, since the menu is
going to be vertical, we only need to add css to animate on the y axis.

```javascript
  var menu = new Physics(menuEl)
    .style('translateY', function(position) { return position.y + 'px' })
```

  What this does is, as the position of the menu changes, (being dragged,
accelerated, or sprung), we update the css `transform: translateY` property, to the
current y position.

  Next we'll create a boundry for where we want the menu to be dragged.
Esentially we're preventing the menu from being pulled past the bottom of
the screen.

```javascript
  var boundry = Physics.Boundry({ top: 0, bottom: window.innerHeight })
```

  Now, to build to the actual interaction, we start off by making the menu
draggable within our boundry.  We specify `handles`, which are the elements
that we interact with to drag the menu.  In this case, that's the hamburger
menu, and the `close` bar on the bottom.

```javascript
var drag = menu.drag({ handle: handleEls, boundry: boundry })
```

  In the background, Luster Physics takes the user input and uses it to move
the menu and calculate the velocity of the user's movements.

  If you run this code right now, you can pull the menu open by dragging
the hambuger menu, but once you let go it just sticks.  The next step is
to create an animation that flows from the user's movement.

  The next step is to animate the menu, once the user has stopped dragging.

```javascript
function end() {
  if(drag.moved()) {
    isOpen = menu.direction('down')
  } else {
    isOpen = !isOpen
  }

  if(isOpen) {
    menu.accelerate({ acceleration: 1500, bounceAcceleration: 4000, bounce: true })
      .to(0, boundry.bottom).start()
  } else {
    menu.spring({ tension: 100, damping: 15 })
      .to(0, boundry.top).start()
  }
}

drag.on('end', end)
```

  The end function we've defined here check's if the user actually moved while
dragging.  If they moved the menu, we determine whether to open or close the
menu based on whether the menu's is currently moving up or down.  If they
didn't move at all(essentially a tap), we just toggle the open state of the
menu.

  Once we know if the menu is opening or closing, we either accelerate to the
bottom, or spring to the top.

  Most of the options (tension, damping, acceleration, etc) are values that I
found by playing around with the numbers until I found something that felt
good.  It's important that you do that yourself, so that the feel of your
interactions fit with your app.

  So now we should have working pull down menu with a nice bounce.

  You can access the full code here.